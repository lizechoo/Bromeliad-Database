class SpeciesC
  CONFIRM_COUNT: 200
  selected: []
  showDrawer: null
  controls:
    species: []
    view: 'classification'
    dataset_id: null
    search: null
    loading: true
    tableInfo:
      total: 0
      page: 1
      count: 20

  constructor: (SpeciesF, SpeciesTableF, DatasetF, ngDialog, LocalStorageF, $scope, $state, $stateParams) ->
    @SpeciesTableF = SpeciesTableF
    @ngDialog = ngDialog
    @SpeciesF = SpeciesF
    @LocalStorageF = LocalStorageF
    @$state = $state
    @dataset = null

    @watchState($scope)

    if dataset_id = $stateParams.dataset_id?
      @controls.dataset_id = $stateParams.dataset_id
      DatasetF.getDataset(@controls.dataset_id)
      .then (dataset) =>
        @dataset = dataset
    else
      @controls.dataset_id = null
      @syncState()

    @tableParams = SpeciesTableF.tableParams(@controls)

    if @isClassification()
      @showClassification()
    if @isTraits()
      @showTraits()
    else if @isTachet()
      @showTachet()

  setCount: (count) ->
    _setCount = (count) =>
      @tableParams.count(count)
      @controls.tableInfo.count = count
      @count = ""

    if (not count) or (count.trim() is "")
      throw new Error "Enter a number"

    if parseInt(count) is 0
      throw new Error "Enter a number greater than 0"

    if isNaN(parseInt(count))
      throw new Error "Number entered is invalid"

    count = parseInt count

    if count > @CONFIRM_COUNT
      @countConfirm()
      .then ->
        _setCount(count)
    else
      _setCount count

  getShowing: ->
    total = @controls.tableInfo.total
    page = @controls.tableInfo.page
    count = @controls.tableInfo.count
    beginning = if (page-1)*count+1 > 0 then (page-1)*count+1 else 0
    end = if page*count > total then total else page*count
    beginning = 0 if end is 0
    "Showing #{beginning} - #{end} of #{total}"

  toggleDrawer: (drawer) ->
    if drawer is @showDrawer
      @showDrawer = null
    else
      @showDrawer = drawer

  exportCurrent: ->
    csv = @SpeciesF.speciesToCSV @controls.species
    'data:text/csv;charset=utf8,' + encodeURIComponent csv

  search: (term) ->
    if /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test term
      return throw new Error 'Search term contains invalid characters'

    if (not term) or (term.trim is "") or (@controls.search isnt term)
      @controls.search = term || ""
      @tableParams.page(1)
      @tableParams.reload()

  clearSearch: ->
    @searchTerm = ''
    @search ''
    @showDrawer = null

  isClassification: ->
    @controls.view is 'classification'

  isTraits: ->
    @controls.view is 'traits'

  isTachet: ->
    @controls.view is 'tachet'

  showClassification: ->
    @controls.view = 'classification'

    @tableParams.reload()
    .then =>
      @columns = @SpeciesTableF.classificationColumns

  showTraits: ->
    @controls.view = 'traits'

    @tableParams.reload()
    .then =>
      @columns = @SpeciesTableF.traitsColumns

  showTachet: ->
    @controls.view = 'tachet'

    @tableParams.reload()
    .then =>
      @columns = @SpeciesTableF.tachetColumns

  edit: ->
    if @selected.length > 1
      throw new Error 'More than 1 species selected. Select only 1 to edit.'
    @$state.go 'species-edit', id: @selected[0]

    @selected = []

  delete: ->
    if @selected.length == 0
      throw new Error "No species selected"

    @confirmDelete @selected.length
    .then =>
      @SpeciesF.deleteSpecies(@selected)
    .then =>
      @selected = []
      @$state.reload()

  confirmDelete: (count) ->
    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: => "#{count} species will be delete. Proceed?"

  countConfirm: ->
    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: => "Showing more than #{@CONFIRM_COUNT} species may make the page unresponsive. Do you wish to continue?"

  upload: ->
    @ngDialog.openConfirm
      template: 'species/upload.html'
      controller: 'SpeciesUploadC'
      controllerAs: 'species'
    .then =>
      @tableParams.reload()

  export: ->
    @ngDialog.openConfirm
      template: 'species/export.html'
      controller: 'SpeciesExportC'
      controllerAs: 'species'
      resolve:
        species: => @controls.species
        selected: => @selected

  syncState: ->
    if state = @LocalStorageF.speciesState.get()
      if state.search
        @controls.search = state.search
      if tableInfo = state.tableInfo
        if tableInfo.page?
          @controls.tableInfo.page = tableInfo.page
        if tableInfo.count? and tableInfo.count < 100
          @controls.tableInfo.count = tableInfo.count
      if state.view?
        @controls.view = state.view

  watchState: ($scope) ->
    $scope.$watch (=> @controls.search)
    , (n, o) =>
      @selected = []

      state = @LocalStorageF.speciesState.get() || {}
      state.search = n
      @LocalStorageF.speciesState.set(state)
    , true

    $scope.$watch (=> @controls.tableInfo)
    , (n, o) =>
      @selected = []

      state = @LocalStorageF.speciesState.get() || {}
      state.tableInfo = n
      @LocalStorageF.speciesState.set(state)
    , true

    $scope.$watch (=> @controls.view)
    , (n, o) =>
      state = @LocalStorageF.speciesState.get() || {}
      state.view = n
      @LocalStorageF.speciesState.set(state)
    , true

app.controller 'SpeciesC', SpeciesC
