app.factory 'BromeliadF', (ApiF, $uibModal) ->
  BromeliadF = {}

  BromeliadF.fields = [
    { field: 'dataset_name', title: 'Dataset', unit: 'name', visible: true, noEdit: true }
    { field: 'visit_habitat', title: 'Visit', unit: 'habitat', visible: true, noEdit: true }
    { field: 'original_id', title: 'Original ID', visible: true }
    { field: 'species', title: 'Species', visible: true }
    { field: 'actual_water', title: 'Actual water', unit: 'ml', visible: true, format: 'number' }
    { field: 'max_water', title: 'Max. water', unit: 'ml', visible: true, format: 'number' }
    { field: 'longest_leaf', title: 'Longest leaf', unit: 'cm', visible: true, format: 'number' }
    { field: 'leaf_width', title: 'Leaf width', unit: 'cm', visible: true, format: 'number' }
    { field: 'num_leaf', title: '# Leaves', visible: true, format: 'number' }
    { field: 'height', title: 'Height', unit: 'cm abv. ground', visible: true, format: 'number' }
    { field: 'diameter', title: 'Diameter', unit: 'cm', visible: true, format: 'number' }
    { field: 'extended_diameter', title: 'Extended diameter', unit: 'cm', visible: true, format: 'number' }
    { field: 'collection_date', title: 'Collection date', visible: true, format: 'date' }
  ]

  BromeliadF.showBromeliad = (bromeliad_id) ->
    $uibModal.open
      templateUrl: 'bromeliad/view.html'
      controller: 'BromeliadViewC'
      controllerAs: 'bromeliad'
      resolve:
        bromeliad_id: -> bromeliad_id

  BromeliadF.getBromeliads = (params = {}) ->
    ApiF.get('bromeliads', 'list', params: params)

  BromeliadF.getBromeliadById = (bromeliad_id) ->
    ApiF.get('bromeliads', 'list', params: bromeliad_id: bromeliad_id)
    .then ([bromeliad]) ->
      return bromeliad

  BromeliadF.getBromeliadsMap = (params = {}) ->
    ApiF.get('bromeliads', 'list', params: params)
    .then (results) ->
      return BromeliadF.mapBromeliads results

  BromeliadF.mapBromeliads = (bromeliads) ->
    obj = {}
    for bromeliad in bromeliads
      obj[bromeliad.bromeliad_id] = bromeliad.original_id
    return obj

  BromeliadF.deleteBromeliads = (bromeliads) ->
    ApiF.postWithLoading('bromeliads', 'delete', null, bromeliads: bromeliads)

  BromeliadF.createBromeliads = (bromeliads, loading = true) ->
    data = []
    for bromeliad in bromeliads
      unless bromeliad?.visit_id?
        throw new Error "A visit must be selected for this bromeliad"
      bromeliad = BromeliadF.omitFields(bromeliad)
      BromeliadF.emptyToNull bromeliad
      BromeliadF.normalizeDetritus bromeliad
      data.push bromeliad

    if loading
      ApiF.postWithLoading('bromeliads', 'new', null, bromeliads: data, BromeliadF.unmapError)
    else
      ApiF.post('bromeliads', 'new', null, bromeliads: data, BromeliadF.unmapError)

  BromeliadF.createBromeliad = (bromeliad) ->
    BromeliadF.createBromeliads [bromeliad]

  BromeliadF.editBromeliad = (bromeliad) ->
    data = {}
    bromeliad_id = bromeliad.bromeliad_id
    bromeliad = BromeliadF.omitFields bromeliad
    bromeliad = BromeliadF.emptyToNull bromeliad
    data[bromeliad_id] = bromeliad
    ApiF.postWithLoading('bromeliads', 'edit', null, bromeliads: data, BromeliadF.unmapError)

  BromeliadF.unmapError = (error) ->
    for c in BromeliadF.fields
      error = error.replace("'#{c.field}'", "<b>#{c.title}</b>")

    return error

  BromeliadF.omitFields = (bromeliad) ->
    bromeliad = _.omit bromeliad, 'bromeliad_id'

  BromeliadF.emptyToNull = (bromeliad) ->
    bromeliad = _.mapObject bromeliad, (value) ->
      if typeof value is 'string' and value.trim() is ''
      then null
      else value

  BromeliadF.normalizeDetritus = (bromeliad) ->
    return unless bromeliad.detritus

    for row in bromeliad.detritus
      if row.mass in ['NA', '']
        row.mass = null

  return BromeliadF
