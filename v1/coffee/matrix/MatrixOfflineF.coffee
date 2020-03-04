app.factory 'MatrixOfflineF', (FileParserF) ->
  MatrixOfflineF = {}

  MatrixOfflineF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel']

  MatrixOfflineF.validateType = (type) ->
    unless type in MatrixOfflineF.SUPPORTED_TYPES
      throw new Error "File type not supported. Please select a CSV or TSV file."

  MatrixOfflineF.generateFile = (matrix, bromeliads) ->
    obj = MatrixOfflineF.fileObject matrix, bromeliads
    Papa.unparse obj

  MatrixOfflineF.fileObject = (matrix, bromeliads)->
    rows = []

    for species_id, species of matrix.species
      bwg_name = species.bwg_name
      for measurement_id, measurement of species.measurements
        row = {}
        row['BWG code'] = bwg_name
        row['Category/Range'] = measurement.category_range
        row['ID'] = measurement_id
        if measurement.category_range is 'category'
          row['Measurement'] = measurement.measurement.value
        else
          min = measurement.measurement.min
          max = measurement.measurement.max
          unit = measurement.measurement.unit
          row['Measurement'] = "#{min} - #{max} #{unit}"
        for bromeliad_id, value of measurement.bromeliads
          row[bromeliads[bromeliad_id]] = value
        rows.push row

    return rows

  MatrixOfflineF.parseFile = (file, matrix, bromeliads) ->
    options =
      header: true
      skipEmptyLines: true
    FileParserF.parse file, options
    .then (data) ->
      MatrixOfflineF.validateFile data, matrix, bromeliads

      measurements = {}
      for row in data
        bwg_name = row['BWG code']
        species = MatrixOfflineF.findSpecies bwg_name, matrix
        measurement_id = row['ID']
        m = MatrixOfflineF.findMeasurement species, measurement_id
        measurements[measurement_id] = {}
        for k, v of row when k not in ['BWG code', 'Category/Range', 'ID', 'Measurement']
          bromeliad_id = MatrixOfflineF.findBromeliadId k, bromeliads
          measurements[measurement_id][bromeliad_id] = v

      return measurements

  MatrixOfflineF.validateFile = (data, matrix, bromeliads) ->
    measurementCount = 0
    for row in data
      bwg_name = row['BWG code']
      measurement_id = row['ID']
      species = MatrixOfflineF.findSpecies bwg_name, matrix
      MatrixOfflineF.findMeasurement species, measurement_id
      measurementCount++

      bromeliadsCount = 0
      for k, v of row when k not in ['BWG code', 'Category/Range', 'ID', 'Measurement']
        MatrixOfflineF.findBromeliadId k, bromeliads
        bromeliadsCount++
      if bromeliadsCount isnt Object.keys(bromeliads).length
        throw new Error "Uploaded matrix is missing some bromeliads columns"

    if measurementCount isnt MatrixOfflineF.countMeasurements(matrix)
      throw new Error "Uploaded matrix is missing some measurements rows"

  MatrixOfflineF.countMeasurements = (matrix) ->
    count = 0

    for species_id, species of matrix.species
      for type, measurement of species.measurements
        count++

    return count

  MatrixOfflineF.findSpecies = (bwg_name, matrix) ->
    for species_id, species of matrix.species
      return species if species.bwg_name is bwg_name

    throw new Error "Species '#{bwg_name}' not found in original matrix"

  MatrixOfflineF.findBromeliadId = (original_id, bromeliads) ->
    for k, v of bromeliads
      if v is original_id
        return k

    throw new Error "Bromeliad '#{original_id}' not found in original matrix"

  MatrixOfflineF.findMeasurement = (species, measurement_id) ->
    bwg_name = species.bwg_name

    unless species.measurements[measurement_id]?
      throw new Error "Species <b>#{bwg_name}</b> does not have the measurement \
      #{measurement} (ID: #{measurement_id}) in original matrix"

    return species.measurements[measurement_id]

  return MatrixOfflineF
