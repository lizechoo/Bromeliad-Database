app.factory 'MeasurementF', (ApiF, $q) ->
  MeasurementF = {}

  MeasurementF.getMeasurements = (dataset_id) ->
    return ApiF.get('measurements', 'list', params: dataset_id: dataset_id)

  MeasurementF.createMeasurements = (dataset_id, measurements) ->
    data =
      dataset_id: dataset_id
      species: measurements
    return ApiF.post('measurements', 'new', null, measurements: [data])

  MeasurementF.editMeasurement = (measurement_id, measurement) ->
    data = {}
    data[measurement_id] = measurement
    return ApiF.post('measurements', 'edit', null, measurements: data)

  MeasurementF.removeMeasurementById = (measurement_id) ->
    ApiF.post('measurements', 'deleteID', null, measurements: [measurement_id])

  MeasurementF.removeMeasurements = (dataset_id, species_id) ->
    data = dataset_id: dataset_id
    if species_id?
      data.species = [species_id]
    else
      data.species = 'all'

    return ApiF.post('measurements', 'delete', null, measurements: [data])

  return MeasurementF
