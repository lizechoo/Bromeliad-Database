app.factory 'SpeciesUploadF', (SpeciesF, $q, ApiF) ->
  SpeciesUploadF = {}
  SpeciesUploadF.MAX_SIZE_MB = 10
  SpeciesUploadF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel']
  SpeciesUploadF.BATCH_SIZE = 20

  isInteger = (str) ->
    /^\+?(0|[1-9]\d*)$/.test(str)

  _isValidTachetValue = (value) ->
    if value is 'NA'
      return true
    return Number.isInteger parseInt(value, 10)

  SpeciesUploadF.getTachetTraits = ->
    SpeciesF.loadTachetTraits()
    .then (results) ->
      return (t.trait for t in results.traits)

  SpeciesUploadF.uploadFile = (file) ->
    formData = new FormData()
    formData.append 'file', file

    options =
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }

    ApiF.post('species', 'upload', options, formData)
    .then (results) ->
      return results.file_id

  SpeciesUploadF.createSpeciesLog = (file_id) ->
    ApiF.get('species', 'log', params: file_id: file_id)
    .then (results) ->
      return results.log_id

  SpeciesUploadF.validateType = (type) ->
    unless type in SpeciesUploadF.SUPPORTED_TYPES
      throw new Error "File type not supported. Please select a CSV or TSV file."

  SpeciesUploadF.validateSize = (size) ->
    if size > (SpeciesUploadF.MAX_BYTE_SIZE * 1024 * 1024)
      throw new Error "File size exceeded 10MB"

  SpeciesUploadF.validateFile = (file) ->
    SpeciesUploadF.getTachetTraits()
    .then (tachet) ->
      SpeciesUploadF.parseFile file, (species, row) ->
        SpeciesUploadF.validateSpecies species, row, tachet
    .catch (err) ->
      throw new Error err

  SpeciesUploadF.parseFile = (file, step) ->
    deferred = $q.defer()
    count = 0
    Papa.parse file,
      header: true
      skipEmptyLines: true
      error: (err, file, inputElem, reason) ->
        deferred.reject "Failed parsing file #{reason}"
      step: (results, parser) ->
        count++
        try
          step results.data[0], count
        catch e
          deferred.reject e.message
          parser.abort()
      complete: ->
        if count is 0
          deferred.reject "File is empty"
        deferred.resolve count
    deferred.promise

  SpeciesUploadF.uploadSpecies = (file, counter, log_id) ->
    deferred = $q.defer()
    pending = []
    batchCount = 0

    Papa.parse file,
      header: true
      skipEmptyLines: true
      step: (results, parser) ->
        species = results.data[0]
        pending.push species
        if pending.length is SpeciesUploadF.BATCH_SIZE
          SpeciesUploadF.uploadBatch angular.copy(pending), log_id
          .then ([inserted, duplicates]) ->
            counter.count += SpeciesUploadF.BATCH_SIZE

            if duplicates
              duplicateRows =
                for row in duplicates
                  row + batchCount * SpeciesUploadF.BATCH_SIZE
            else
              duplicateRows = []

            counter.duplicates.push duplicateRows...
            batchCount++
            parser.resume()

          pending = []
          parser.pause()
      complete: ->
        if pending.length > 0
          SpeciesUploadF.uploadBatch angular.copy(pending), log_id
          .then ([inserted, duplicates]) ->
            counter.count += pending.length

            if duplicates
              duplicateRows =
                for row in duplicates
                  row + batchCount * SpeciesUploadF.BATCH_SIZE
            else
              duplicateRows = []

            counter.duplicates.push duplicateRows...

            deferred.resolve true
            pending = []
        else
          deferred.resolve true

    deferred.promise

  SpeciesUploadF.uploadBatch = (batch, log_id) ->
    data = []
    for species in batch
      obj = SpeciesUploadF.objectifySpecies species
      data.push obj

    SpeciesF.createSpeciesBatch data, log_id

  SpeciesUploadF.objectifySpecies = (species) ->
    obj = {}
    for k, v of species
      if v? and typeof v is 'string'
        v = v.trim()
      if k? and typeof k is 'string'
        k = k.trim()

      lowerCaseKey = k.toLowerCase()
      found = false

      for column in SpeciesF.classificationColumns
        if lowerCaseKey is column.label.toLowerCase() or
        lowerCaseKey is column.field or
        (column.alias and column.alias.length > 0 and lowerCaseKey in column.alias)
          obj[column.field] = v
          found = true

      if !found

        if k.length > 4 and k.substring(0,4) is 'name' and isInteger(k.substring(4))
          obj.names ||= []
          unless v in obj.names or v is 'NA' or v is ''
            obj.names.push v
        else if k.length > 7 and k.substring(0,7) is 'tachet:'
          obj.tachet ||= {}
          unless v is 'NA' or v is ''
            obj.tachet[k.substring(7)] = v
        else
          obj.traits ||= {}
          unless v is 'NA' or v is ''
            obj.traits[k] = v
    return obj

  SpeciesUploadF.validateSpecies = (species, row, tachetList) ->
    for column in SpeciesF.classificationColumns
      found = false
      for k, v of species
        if v? and typeof v is 'string'
          v = v.trim()
        if k? and typeof k is 'string'
          k = k.trim()
        lowerCaseKey = k.toLowerCase()
        if lowerCaseKey is column.label.toLowerCase() or
        lowerCaseKey is column.field or
        (column.alias and column.alias.length > 0 and lowerCaseKey in column.alias)
          found = true

          # if column is a selection, check if value is one of options
          if column.options?
            if v not in column.options
              throw new Error "Invalid option for #{column.label}: #{v}<br>\
              Available options: #{column.options.join(', ')}
              "

      unless found
        throw new Error "Missing classification field: #{column.field}"

    for k, v of species
      if v? and typeof v is 'string'
        v = v.trim()
      if k? and typeof k is 'string'
        k = k.trim()
      names = []
      if k in ['name', 'type', 'value', 'species_id', 'trait', 'tachet']
        throw new Error "Column '#{k}' cannot not be used"

      if k.length > 7 and k.substring(0,7) is 'tachet:'
        unless k.substring(7) in tachetList
          throw new Error "Tachet trait '#{k.substring(7)}' does not exist"

        if not _isValidTachetValue(v)
          throw new Error "Tachet trait must have value 'NA' or 0-3"

      if k.length > 4 and k.substring(0,4) is 'name' and isInteger(k.substring(4))
        if v in names
          throw new Error "Row #{row}: Duplicate alternate names"
        names.push v

  return SpeciesUploadF
