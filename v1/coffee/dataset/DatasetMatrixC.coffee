class DatasetMatrixC
  constructor: (DatasetF, MatrixF, BromeliadF, SpeciesF, $stateParams, $state, $scope) ->
    @MatrixF = MatrixF
    @BromeliadF = BromeliadF
    @dataset_id = $stateParams.dataset_id
    @DatasetF = DatasetF
    @showSpecies = SpeciesF.showSpecies

    @showBromeliad = BromeliadF.showBromeliad

    @loadData()

    $scope.$watch (-> MatrixF.editingMatrix), (n, o) =>
      if o and not n
        @loadData()

  loadData: ->
    @loadBromeliads().then =>
      @loadMatrix()
    .then =>
      console.log @

  loadMatrix: ->
    @MatrixF.getMatrix(@dataset_id)
    .then (matrix) =>
      @matrix = matrix

  loadBromeliads: ->
    @BromeliadF.getBromeliads(dataset_id: @dataset_id)
    .then (bromeliads) =>
      @bromeliads = bromeliads

  isEditingMatrix: ->
    @MatrixF.editingMatrix

  isMissingBromeliads: ->
    @MatrixF.noBromeliads

  isEmpty: (obj) ->
    return false unless obj
    return Object.keys(obj).length is 0

app.controller 'DatasetMatrixC', DatasetMatrixC
