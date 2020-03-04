class DatasetOverviewC
  constructor: (DatasetF, VisitF, BromeliadF, $stateParams, $state, DialogF) ->
    @DatasetF = DatasetF
    @VisitF = VisitF
    @BromeliadF = BromeliadF
    @DialogF = DialogF
    @visitFields = VisitF.fields
    @bromeliadFields = BromeliadF.fields
    @dataset_id = $stateParams.dataset_id
    @$state = $state
    @data = {}

    @showBromeliad = BromeliadF.showBromeliad

    @visits = []
    @bromeliads = []
    @selectedVisit = null

    @loadDataset()
    @loadVisits()
    .then =>
      @loadBromeliads()
    .then =>
      @populateVisitHabitat()

  loadDataset: ->
    @DatasetF.getDataset(@dataset_id)
    .then (dataset) =>
      @data = dataset

  loadVisits: ->
    @VisitF.getVisits(@dataset_id)
    .then (visits) =>
      @visits = visits

  loadBromeliads: (visit_id) ->
    params = if visit_id? then visit_id: visit_id else dataset_id: @dataset_id
    @BromeliadF.getBromeliads(params)
    .then (bromeliads) =>
      @bromeliads = bromeliads

  populateVisitHabitat: ->
    for bromeliad in @bromeliads
      bromeliad.visit_habitat = do =>
        return v.habitat for v in @visits when v.visit_id is bromeliad.visit_id

  filterBromeliads: (visit_id) ->
    return [] unless @bromeliads.length > 0
    return (b for b in @bromeliads when b.visit_id is visit_id)

  getBromeliads: ->
    if @selectedVisit? then @filterBromeliads(@selectedVisit) else @bromeliads

  viewBromeliads: ->
    if @selectedVisit
      @$state.go 'bromeliad', visit_id: @selectedVisit
    else
      @$state.go 'bromeliad', dataset_id: @dataset_id

  toggleVisit: (visit) ->
    @selectedVisit = if visit.visit_id is @selectedVisit then null else visit.visit_id

  isVisitSelected: (visit) ->
    visit.visit_id is @selectedVisit

  getSelectedVisit: ->
    return visit for visit in @visits when visit.visit_id is @selectedVisit

  hasBromeliads: ->
    not @selectedVisit and @getBromeliads()?.length > 0

app.controller 'DatasetOverviewC', DatasetOverviewC
