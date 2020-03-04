app.factory 'MatrixF', (ApiF, DialogF, ngDialog, BromeliadF, $q) ->
  MatrixF = {}

  MatrixF.getMatrix = (dataset_id) ->
    ApiF.get('matrix', 'list', params: dataset_id: dataset_id)
    .then (matrix) ->
      MatrixF.noBromeliads = false
      MatrixF.setEditData matrix
      return matrix
    .catch (err) ->
      if err is 'NO_BROMELIADS'
        MatrixF.noBromeliads = true
      else
        throw new Error err

  MatrixF.editingMatrix = false

  MatrixF.editData = {}

  MatrixF.setEditData = (matrix) ->
    for species_id, species of matrix.species
      for measurement_id, measurement of species.measurements
        bromeliads = {}
        for k, count of measurement.bromeliads
          bromeliads[k] = if count is 'NA' then '' else count
        MatrixF.editData[measurement_id] = bromeliads: bromeliads

  MatrixF.editMatrix = (finish = false) ->
    if finish
      data = angular.copy MatrixF.editData

      DialogF.confirmDialog "Matrix will be updated. Proceed?"
      .then ->
        MatrixF.updateMatrix(data)
      .then ->
        DialogF.successDialog "Matrix successfully updated"
        MatrixF.editData = {}
        MatrixF.editingMatrix = false
      .catch ->
        MatrixF.editData = {}
        MatrixF.editingMatrix = false
    else
      MatrixF.editingMatrix = true

  MatrixF.updateMatrix = (data) ->
    data = MatrixF.omitEmpty data
    ApiF.postWithLoading('matrix', 'edit', null, measurements: data)

  MatrixF.omitEmpty = (data) ->
    omitted = {}
    for measurement_id, measurement of data
      for bromeliad_id, count of measurement.bromeliads
        if count?.trim() is ''
          count = 'NA'
        omitted[measurement_id] ||= bromeliads: {}
        omitted[measurement_id].bromeliads[bromeliad_id] = count
    return omitted

  MatrixF.offline = (dataset_id) ->
    DialogF.confirmDialog "Unsaved changes will be reverted. Proceed?"
    .then =>
      promises = [
        MatrixF.getMatrix(dataset_id)
        BromeliadF.getBromeliadsMap dataset_id: dataset_id
      ]

      $q.all promises
      .then ([matrix, bromeliads]) ->
        MatrixF.offlineDialog matrix, bromeliads
      .then (measurements) ->
        MatrixF.applyUpload measurements

  MatrixF.applyUpload = (measurements) ->
    for measurement_id, measurement of MatrixF.editData
      for bromeliad_id, value of measurement.bromeliads
        newValue = measurements[measurement_id][bromeliad_id]
        MatrixF.editData[measurement_id].bromeliads[bromeliad_id] = newValue

  MatrixF.offlineDialog = (matrix, bromeliads) ->
    ngDialog.openConfirm
      template: 'matrix/offline.html'
      controller: 'MatrixOfflineC'
      controllerAs: 'matrix'
      resolve:
        matrix: -> matrix
        bromeliads: -> bromeliads

  return MatrixF
