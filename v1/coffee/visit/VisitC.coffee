class VisitC

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

  constructor: (VisitF, DatasetF, DialogF, $stateParams, ngDialog, $uibModal, $window) ->
    @VisitF = VisitF
    @DialogF = DialogF
    @field = VisitF.fields
    @ngDialog = ngDialog
    @$uibModal = $uibModal
    @$window = $window
    @dataset_id = $stateParams.dataset_id
    @selected = []
    @loadVisits()

    DatasetF.getDatasets()
    .then (datasets) =>
      @datasets = datasets

    if @dataset_id?
      DatasetF.getDataset(@dataset_id)
      .then (dataset) =>
        @dataset = dataset

  loadVisits: ->
    @VisitF.getVisits(@dataset_id)
    .then (visits) =>
      @data = visits

  # Actions
  back: ->
    @$window.history.back();

  new: ->
    modal = @$uibModal.open
      templateUrl: 'visit/edit.html'
      controller: 'VisitEditC'
      controllerAs: 'visit'
      keyboard: false
      backdrop: 'static'
      resolve:
        dataset_id: => @dataset_id
        edit: -> null

    modal.result.then (success) =>
      @DialogF.successDialog("Visit successfully created")
    .then =>
      @loadVisits()

  edit: ->
    if @selected.length > 1
      throw new Error "Select only one visit to edit"

    visit = v for v in @data when v.visit_id is @selected[0]

    modal = @$uibModal.open
      templateUrl: 'visit/edit.html'
      controller: 'VisitEditC'
      controllerAs: 'visit'
      keyboard: false
      backdrop: 'static'
      resolve:
        edit: => angular.copy visit
        dataset_id: null

    modal.result.then (success) =>
      @DialogF.successDialog("Visit successfully edited")
    .then =>
      @loadVisits()

  delete: ->
    if @selected.length == 0
      throw new Error "Select at least 1 visit to delete"

    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: => "#{@selected.length} visits will be delete. Proceed?"
    .then =>
      @VisitF.deleteVisits(@selected)
    .then =>
      @ngDialog.openConfirm
        template: 'successDialog.html'
        controller: 'ConfirmC'
        resolve:
          doubleConfirm: -> null
          message: => "Visits successfully deleted"
    .then =>
      @selected = []
      @loadVisits()

  # Selects
  clearSelected: -> @selected = []

  toggleSelect: (visit) ->
    if visit.visit_id in @selected
      @selected = @selected.filter (e) ->
        e isnt visit.visit_id
    else
      @selected.push visit.visit_id

  isSelected: (visit) ->
    visit.visit_id in @selected

  hasSelected: ->
    @selected.length > 0

app.controller 'VisitC', VisitC
