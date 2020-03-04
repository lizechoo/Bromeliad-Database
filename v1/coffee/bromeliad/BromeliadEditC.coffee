class BromeliadEditC
  constructor: (visit_id, edit, DatasetF, VisitF, BromeliadF, $uibModalInstance, ngDialog, BromeliadHelp) ->
    @DatasetF = DatasetF
    @VisitF = VisitF
    @BromeliadF = BromeliadF
    @BromeliadHelp = BromeliadHelp
    @$uibModalInstance = $uibModalInstance
    @ngDialog = ngDialog

    @attributes = [type: '', value: '']
    if edit
      @edit = @pruneNA(edit)
      @loadAttributes edit.attributes if edit.attributes
      delete @edit.attributes
    @data = {}
    if !@edit and visit_id
      @data = visit_id: visit_id, detritus: []
    if @edit
      @data = @edit

    @loadDatasets()

  help: (section) ->
    @BromeliadHelp[section]

  cancel: ->
    @$uibModalInstance.dismiss()

  submit: ->
    @validateAttributes @attributes
    attributes = @parseAttributes @attributes
    data = angular.copy @data
    data.attributes = attributes
    if @edit
      @BromeliadF.editBromeliad data
      .then =>
        @$uibModalInstance.close(true)
    else
      @BromeliadF.createBromeliad data
      .then =>
        @$uibModalInstance.close(true)

  loadDatasets: ->
    @DatasetF.getDatasets()
    .then (datasets) =>
      @datasets = datasets
      return @loadVisits()
    .then =>
      for visit in @visits
        for dataset in @datasets when dataset.dataset_id is visit.dataset_id
          visit.dataset_name = dataset.name

  loadVisits: ->
    @VisitF.getVisits()
    .then (visits) =>
      @visits = visits

  pruneNA: (data) ->
    result = {}
    for k, v of data
      result[k] = if v is 'NA' then null else v
    return result

  # Attribute controls
  addAttribute: ->
    @attributes.push type: '', value: ''

  showDetritus: ->
    if not @data.detritus
      @data.detritus = []

    @ngDialog.openConfirm
      template: 'bromeliad/detritus.html'
      controller: 'BromeliadDetritusEditC'
      controllerAs: 'bromeliad'
      showClose: false
      resolve:
        detritus: => @data.detritus
    .then (detritus) =>
      @data.detritus = detritus

  parseAttributes: (attributes) ->
    obj = {}
    for attribute in attributes
      continue unless attribute.type?.trim() isnt '' and attribute.value?.trim() isnt ''
      obj[attribute.type] = attribute.value
    return obj

  loadAttributes: (attributes) ->
    @attributes = []
    for type, value of attributes
      @attributes.push type: type, value: value

  removeAttribute: (index) ->
    @attributes.splice(index, 1)

  validateAttributes: (attributes) ->
    if attributes and attributes.length > 0
      size = attributes.length
      for i in [0..size-1]
        for k in [0..size-1] when i isnt k
          continue unless attributes[i].type and attributes[i].value
          if attributes[i].type is attributes[k].type
            throw new Error "Duplicate type in attributes"

app.controller 'BromeliadEditC', BromeliadEditC
