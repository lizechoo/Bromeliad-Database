class BromeliadC

  sorting:
    field: null
    desc: null
    is: (field, desc) ->
      (field is @field) and (desc is @desc)
    sort: (field) ->
      if @field is field
        @desc = if @desc then false else true
      else
        @field = field
        @desc = false

  constructor: (BromeliadF, DatasetF, VisitF, $window, $stateParams, $uibModal,
  DialogF, ngDialog, BromeliadUploadF, BromeliadHelp) ->
    @BromeliadF = BromeliadF
    @BromeliadUploadF = BromeliadUploadF
    @showBromeliad = BromeliadF.showBromeliad
    @fields = BromeliadF.fields
    @DatasetF = DatasetF
    @VisitF = VisitF
    @$window = $window
    @data = []
    @$uibModal = $uibModal
    @DialogF = DialogF
    @ngDialog = ngDialog
    @BromeliadHelp = BromeliadHelp

    if $stateParams.dataset_id?
      @dataset_id = $stateParams.dataset_id
    else if $stateParams.visit_id?
      @visit_id = $stateParams.visit_id

    @selected = []

    @loadDatasets()
    .then =>
      @loadBromeliads()

  upload: ->
    @BromeliadUploadF.uploadDialog(@visit_id)
    .then =>
      @loadBromeliads()

  new: ->
    modal = @$uibModal.open
      templateUrl: 'bromeliad/edit.html'
      controller: 'BromeliadEditC'
      controllerAs: 'bromeliad'
      backdrop: 'static'
      keyboard: false
      resolve:
        dataset_id: => @dataset_id
        visit_id: => @visit_id
        edit: -> null

    modal.result.then (success) =>
      @DialogF.successDialog("Bromeliad successfully created")
    .then =>
      @loadBromeliads()

  edit: ->
    if @selected.length > 1
      throw new Error "Select only one bromeliad to edit"

    bromeliad = b for b in @data when b.bromeliad_id is @selected[0]

    modal = @$uibModal.open
      templateUrl: 'bromeliad/edit.html'
      controller: 'BromeliadEditC'
      controllerAs: 'bromeliad'
      keyboard: false
      backdrop: 'static'
      resolve:
        dataset_id: null
        visit_id: null
        edit: _.omit bromeliad, ['dataset_id', 'dataset_name', 'visit_habitat']

    modal.result.then (success) =>
      @DialogF.successDialog("Bromeliads successfully edited")
    .then =>
      @loadBromeliads()

  back: ->
    @$window.history.back()

  delete: ->
    if @selected.length == 0
      throw new Error "Select at least 1 bromeliad to delete"

    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: => "#{@selected.length} bromeliads will be delete. Proceed?"
    .then =>
      @BromeliadF.deleteBromeliads(@selected)
    .then =>
      @ngDialog.openConfirm
        template: 'successDialog.html'
        controller: 'ConfirmC'
        resolve:
          doubleConfirm: -> null
          message: => "Bromeliads successfully deleted"
    .then =>
      @selected = []
      @loadBromeliads()

  loadDatasets: ->
    @DatasetF.getDatasets()
    .then (datasets) =>
      @datasets = datasets
      for d in @datasets when d.dataset_id is @dataset_id
        @dataset = d

      @loadVisits()

  loadVisits: ->
    @VisitF.getVisits()
    .then (visits) =>
      if @visit_id
        for v in visits when v.visit_id is @visit_id
          @visit = v
        @visits = (v for v in visits when v.dataset_id is @visit.dataset_id)
        for d in @datasets when d.dataset_id is @visit.dataset_id
          @dataset = d

      else if @dataset_id
        @visits = (v for v in visits when v.dataset_id is @dataset_id)
      else
        @visits = visits

  populateVisitHabitat: ->
    for bromeliad in @data
      for visit in @visits when visit.visit_id is bromeliad.visit_id
        bromeliad.visit_habitat = visit.habitat

  populateDataset: ->
    for bromeliad in @data
      for visit in @visits when visit.visit_id is bromeliad.visit_id
        bromeliad.dataset_id = visit.dataset_id
        for dataset in @datasets when dataset.dataset_id is visit.dataset_id
          bromeliad.dataset_name = dataset.name

  updateBromeliads: (bromeliads) ->
    @data = bromeliads
    @attributes = _getAttributes(bromeliads)

  loadBromeliads: ->
    if @dataset_id?
      params = dataset_id: @dataset_id
    else if @visit_id?
      params = visit_id: @visit_id
    @BromeliadF.getBromeliads(params)
    .then (bromeliads) =>
      @updateBromeliads bromeliads
    .then =>
      @populateVisitHabitat()
    .then =>
      @populateDataset()

  # Selection
  clearSelected: -> @selected = []

  toggleSelect: (bromeliad) ->
    if bromeliad.bromeliad_id in @selected
      @selected = @selected.filter (e) ->
        e isnt bromeliad.bromeliad_id
    else
      @selected.push bromeliad.bromeliad_id

  isSelected: (bromeliad) ->
    bromeliad.bromeliad_id in @selected

  hasSelected: ->
    @selected.length > 0

  help: (section) ->
    @BromeliadHelp[section]

  # return an array of attributes from the list of bromeliads
  _getAttributes = (bromeliads) ->
    attributes = {}
    for bromeliad in bromeliads when bromeliad.attributes
      for k, v of bromeliad.attributes
        attributes[k] = true
    return (k for k, v of attributes)

app.controller 'BromeliadC', BromeliadC
