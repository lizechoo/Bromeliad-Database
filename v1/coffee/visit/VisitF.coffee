app.factory 'VisitF', (ApiF, ValidatorF, $uibModal) ->
  VisitF = {}

  VisitF.fields = [
    { field: 'visit_id', title: 'ID', visible: false, noEdit: true }
    { field: 'dataset_name', title: 'Dataset', visible: true, noEdit: true }
    { field: 'dataset_id', visible: false }
    { field: 'date', title: 'Date', visible: true, format: 'date' }
    { field: 'habitat', title: 'Habitat', visible: true, required: true }
    { field: 'min_rainfall', title: 'Min. Rainfall', visible: true, format: 'number', unit: 'mm' }
    { field: 'max_rainfall', title: 'Max. Rainfall', visible: true, format: 'number', unit: 'mm' }
    { field: 'min_temperature', title: 'Min. Temperature', visible: true, format: 'number', unit: '°C' }
    { field: 'max_temperature', title: 'Max. Temperature', visible: true, format: 'number', unit: '°C'}
    { field: 'min_elevation', title: 'Min. Elevation', visible: true, format: 'number', unit: 'm'}
    { field: 'max_elevation', title: 'Max. Elevation', visible: true, format: 'number', unit: 'm' }
    { field: 'collection_method', title: 'Collection method', visible: true, options: ['NA', 'pipet', 'dissection', 'washing', 'beating', 'incomplete'] }
    { field: 'latitude', title: 'latitude', visible: true, format: 'lat', unit: 'DD'}
    { field: 'longitude', title: 'longitude', visible: true, format: 'lng', unit: 'DD' }
    { field: 'meta', title: 'meta', visible: false }
  ]

  VisitF.showVisit = (visit_id) ->
    $uibModal.open
      templateUrl: 'visit/view.html'
      controller: 'VisitViewC'
      controllerAs: 'visit'
      resolve:
        visit_id: -> visit_id

  VisitF.getVisits = (dataset_id) ->
    params = if dataset_id? then dataset_id: dataset_id else {}
    ApiF.get('visits', 'list', params: params)

  VisitF.getVisitById = (visit_id) ->
    ApiF.get('visits', 'list', params: visit_id: visit_id)
    .then (visits) ->
      if not visits or visits.length < 1
        throw new Error "Visit not found"
      else
        return visits[0]

  VisitF.deleteVisits = (visits) ->
    ApiF.postWithLoading('visits', 'delete', null, visits: visits)

  VisitF.createVisit = (visit) ->
    visit = VisitF.omitEmptyFields visit
    visit = VisitF.requestFields visit
    VisitF.validateVisit(visit)
    ApiF.postWithLoading('visits', 'new', null, visits: [visit], VisitF.unmapError)

  VisitF.editVisit = (visit_id, visit) ->
    visit = VisitF.emptyToNull visit
    visit = VisitF.requestFields visit
    VisitF.validateVisit(visit)
    visit = _.omit visit, 'visit_id'
    data = visits: {}
    data.visits[visit_id] = visit
    ApiF.postWithLoading('visits', 'edit', null, data, VisitF.unmapError)

  VisitF.validateVisit = (visit) ->
    unless visit.dataset_id?
      throw new Error "Select a dataset from the dropdown menu"
    for row in VisitF.fields when not row.noEdit
      if row.required and (!visit[row.field] or visit[row.field].trim() is '')
        throw new Error "#{row.title} is required"
      if row.options and (visit[row.field] not in row.options)
        throw new Error "#{row.title} must be one the options"
      if row.format
        switch row.format
          when 'date' then ValidatorF.validateDate row.title, visit[row.field]
          when 'number' then ValidatorF.validateNumber row.title, visit[row.field]
          when 'lat' then ValidatorF.validateLat row.title, visit[row.field]
          when 'lng' then ValidatorF.validateLng row.title, visit[row.field]

  VisitF.omitEmptyFields = (visit) ->
    return _.omit visit, (value, key, object) ->
      typeof value is 'string' and value.trim() is ""

  VisitF.requestFields = (visit) ->
    fields = (row.field for row in VisitF.fields when not row.noEdit)
    return _.pick visit, fields

  VisitF.emptyToNull = (visit) ->
    return _.mapObject visit, (value) ->
      if typeof value is 'string' and value.trim() is ""
        return null
      else
        return value

  VisitF.unmapError = (error) ->
    for c in VisitF.fields
      error = error.replace("'#{c.field}'", "<b>#{c.title}</b>")

    return error

  return VisitF
