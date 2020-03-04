class DatasetC
  constructor: (DatasetF, ngDialog, DialogF, HelpMessageF, $uibModal, $filter, $q) ->
    @DatasetF = DatasetF
    @ngDialog = ngDialog
    @HelpMessageF = HelpMessageF
    @DialogF = DialogF
    @$q = $q
    @$filter = $filter
    @$uibModal = $uibModal

    @datasets = []

    @loadDatasets()

  sortField: 'country'
  orderBy: 'asc'

  sortable: [
    { field: 'country', label: 'Country', icon: 'fa-globe' }
    { field: 'year',    label: 'Year'   , icon: 'fa-calendar' }
    { field: 'num_species', label: '# Species', icon: 'fa-bug' }
    { field: 'num_bromeliads', label: '# Bromeliads', icon: 'fa-tree' }
  ]

  newDatasetDialog: ->
    modal = @$uibModal.open
      templateUrl: 'dataset/edit.html'
      controller: 'DatasetEditC'
      controllerAs: 'dataset'
      resolve:
        edit: => null

    modal.result.then =>
      @DialogF.successDialog "Dataset successfully created"
    .then =>
      @loadDatasets()

  edit: (dataset) ->
    modal = @$uibModal.open
      templateUrl: 'dataset/edit.html'
      controller: 'DatasetEditC'
      controllerAs: 'dataset'
      resolve:
        edit: => angular.copy dataset

    modal.result.then =>
      @DialogF.successDialog "Dataset successfully updated"
    .then =>
      @loadDatasets()

  help: (message) ->
    @HelpMessageF.getHelp('Dataset', message)

  loadDatasets: ->
    @DatasetF.getDatasets()
    .then (datasets) =>
      @datasets = datasets
      @sort()

  delete: (dataset) ->
    @confirmDelete(dataset)
    .then =>
      @DatasetF.deleteDataset(dataset.dataset_id)
    .then =>
      @DialogF.successDialog "Dataset successfully removed"
    .then =>
      @loadDatasets()

  confirmDelete: (dataset) ->
    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> "Enter name of dataset"
        message: => "<b>#{dataset.name}</b> and all its visits, bromeliads \
        and measurements will be deleted. Proceed?"
    .then (confirmText) ->
      if confirmText and confirmText is dataset.name
        return true
      else
        throw new Error "Dataset name entered does not match its record. <br>Please try again!"
        return @$q.reject()

  sort: (field = @sortField, order = @orderBy) ->
    console.log "sort called #{@sortField} #{order}"
    @sortField = field
    asc = order is 'asc'
    @datasets = @$filter('orderBy')(@datasets, field, !asc)

  order: (order) ->
    @orderBy = order
    @datasets = @sort(@sortField, order)

app.controller 'DatasetC', DatasetC
