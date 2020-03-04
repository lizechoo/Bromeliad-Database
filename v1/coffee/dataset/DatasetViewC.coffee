class DatasetViewC
  constructor: (DatasetF, $stateParams, $window, $state, DialogF, MatrixF) ->
    @DatasetF = DatasetF
    @DialogF = DialogF
    @dataset_id = $stateParams.dataset_id
    @$window = $window
    @$state = $state
    @MatrixF = MatrixF

    @loadDataset()

  back: ->
    @$state.go('dataset')

  edit: ->
    @DatasetF.editDialog @data
    .then =>
      @$state.reload()

  offline: ->
    @MatrixF.offline @dataset_id

  editMatrix: (finish = false) ->
    @MatrixF.editMatrix finish

  isEditingMatrix: ->
    @MatrixF.editingMatrix

  isMissingBromeliads: ->
    @MatrixF.noBromeliads

  loadDataset: ->
    @DatasetF.getDataset(@dataset_id)
    .then (dataset) =>
      @data = dataset

app.controller 'DatasetViewC', DatasetViewC
