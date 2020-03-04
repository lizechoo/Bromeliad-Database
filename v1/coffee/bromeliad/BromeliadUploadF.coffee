app.factory 'BromeliadUploadF', (BromeliadF, FileParserF, ValidatorF, ngDialog) ->
  BromeliadUploadF = {}
  BromeliadUploadF.MAX_SIZE_MB = 10
  BromeliadUploadF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel']

  BromeliadUploadF.uploadDialog = (visit_id) ->
    unless visit_id?
      throw new Error "Select a visit from the dropdown first"

    ngDialog.openConfirm
      template: 'bromeliad/upload.html'
      controller: 'BromeliadUploadC'
      controllerAs: 'bromeliad'
      resolve:
        visit_id: -> visit_id

  BromeliadUploadF.validateType = (type) ->
    unless type in BromeliadUploadF.SUPPORTED_TYPES
      throw new Error "File type not supported. Please select a CSV or TSV file.\n
      File type: #{type}"

  BromeliadUploadF.validateSize = (size) ->
    if size > (BromeliadUploadF.MAX_BYTE_SIZE * 1024 * 1024)
      throw new Error "File size exceeded 10MB"

  BromeliadUploadF.validateFile = (file) ->
    BromeliadUploadF.parseFile file
    .then (rows) ->
      results = []

      for row in rows
        mapped = BromeliadUploadF.mapTitle row
        BromeliadUploadF.validateBromeliad mapped
        results.push mapped

      return results

  BromeliadUploadF.parseFile = (file) ->
    FileParserF.parse file,
      header: true
      skipEmptyLines: true

  BromeliadUploadF.mapTitle = (row) ->
    obj = {}

    for column in BromeliadF.fields
      if column.noEdit
        if row[column.field]
          throw new Error "File should not contain field: #{column.field}"
        else
          continue

      if not row[column.field]?
        throw new Error "Missing field: #{column.field}"

      obj[column.field] = row[column.field]

    # set field to null if it's NA
    for k, v of obj when v is 'NA'
      obj[k] = null

    for k, v of row when not obj.hasOwnProperty(k)
      continue unless k.length > 0

      if k.length < 10 or k.substring(0, 9) not in ['detritus:', 'detritus>']
        # then this is an attribute field
        obj.attributes ||= {}
        obj.attributes[k] = v

      else
        if k.substring(9).length is 0
          throw new Error 'Missing sieve range for detritus field'

        rangeString = k.substring(9)

        if k.substring(0, 9) is 'detritus>'
          # is the a ">MAX"
          [min, max] = [rangeString.substring(1), null]
        else
          ranges = rangeString.split "-"
          if ranges.length isnt 2
            throw new Error "Detritus field not formatted properly: #{rangeString}"

          [min, max] = ranges
        obj.detritus ||= []
        obj.detritus.push min: min, max: max, mass: v

    return obj

  BromeliadUploadF.validateBromeliad = (bromeliad) ->
    if not bromeliad.original_id?
      throw new Error "Missing original_id column"

    for field in BromeliadF.fields
      if (value = bromeliad[field.field])? and field.format?
        switch field.format
          when 'date' then ValidatorF.validateDate field.title, value
          when 'number' then ValidatorF.validateNumber field.title, value, true

  return BromeliadUploadF
