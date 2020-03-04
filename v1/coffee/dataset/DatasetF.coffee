app.factory 'DatasetF', (ApiF, $q, ngDialog, DialogF, ValidatorF, $uibModal) ->
  DatasetF = {}

  DatasetF.editingMatrix = false
  DatasetF.matrixData = {}

  DatasetF.fieldMap =
    name: 'Name'
    year: 'Year'
    country: 'Country'
    location: 'Location'
    lat: 'Latitude'
    lng: 'Longitude'

  DatasetF.getDataset = (dataset_id) ->
    return ApiF.get('datasets', 'list', params: dataset_id: dataset_id)
    .then (results) ->
      if results.length is 1
        return results[0]
      else
        throw new Error "Dataset not found"

  DatasetF.getDatasets = ->
    return ApiF.get('datasets', 'list', null)

  DatasetF.editDialog = (dataset) ->
    modal = $uibModal.open
      templateUrl: 'dataset/edit.html'
      controller: 'DatasetEditC'
      controllerAs: 'dataset'
      resolve:
        edit: => angular.copy dataset

    modal.result.then =>
      DialogF.successDialog "Dataset successfully updated"

  DatasetF.deleteDataset = (dataset_id) ->
    ApiF.postWithLoading('datasets', 'delete', null, datasets: [dataset_id])

  DatasetF.unmapError = (message) ->
    for k, v of DatasetF.fieldMap
      error = message.replace "Field '#{k}'", v
    message

  DatasetF.createDataset = (dataset) ->
    dataset = _omitEmptyFields(dataset)
    _validateDataset(dataset)

    ApiF.postWithLoading('datasets', 'new', null, datasets: [dataset], DatasetF.unmapError)

  DatasetF.editDataset = (dataset_id, dataset) ->
    throw new Error "Missing dataset_id" unless dataset_id
    data = {}
    data[dataset_id] = _omitEmptyFields(dataset)
    _validateDataset data[dataset_id]
    ApiF.postWithLoading('datasets', 'edit', null, datasets: data, DatasetF.unmapError)

  _omitEmptyFields = (data) ->
    dataset =
      name: data.name
      year: data.year
      country: data.country
      location: data.location
      lat: if data.lat and data.lat.length > 0 then data.lat else 'NA'
      lng: if data.lng and data.lng.length > 0 then data.lng else 'NA'
      owner_name: if data.owner_name and data.owner_name.length > 0 then data.owner_name else 'NA'
      owner_email: if data.owner_email and data.owner_email.length > 0 then data.owner_email else 'NA'
      owner2_name: if data.owner2_name and data.owner2_name.length > 0 then data.owner2_name else 'NA'
      owner2_email: if data.owner2_email and data.owner2_email.length > 0 then data.owner2_email else 'NA'
      bwg_release: if data.bwg_release and data.bwg_release.length > 0 then data.bwg_release else null
      public_release: if data.public_release and data.public_release.length > 0 then data.public_release else null
      faculty_name: if data.faculty_name and data.faculty_name.length > 0 then data.faculty_name else 'NA'
      faculty_email: if data.faculty_email and data.faculty_email.length > 0 then data.faculty_email else 'NA'

  _validateDataset = (dataset) ->
    required = ['name', 'year', 'country', 'location']
    for field in required
      unless dataset?[field] and dataset[field].length > 0
        throw new Error "Missing required field #{field}"
    if "year" in required and dataset.year < 1900 or dataset.year > 2100
      throw new Error "Year must be between 1900 and 2100"
    if lat = dataset['lat'] and lat isnt 'NA'
      ValidatorF.validateLat lat
    if lng = dataset['lng'] and lat isnt 'NA'
      ValidatorF.validateLng lng

  return DatasetF
