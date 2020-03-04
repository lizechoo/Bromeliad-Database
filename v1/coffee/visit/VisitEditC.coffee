class VisitEditC
  constructor: (edit, dataset_id, $uibModalInstance, VisitF, DatasetF, ValidatorF) ->
    if edit
      @edit = @pruneNA(edit)
    @data = {}
    @data = dataset_id: dataset_id if !@edit and dataset_id
    @data = edit if @edit

    @$uibModalInstance = $uibModalInstance
    @collectionMethods = v.options for v in VisitF.fields when v.field is 'collection_method'
    @DatasetF = DatasetF
    @ValidatorF = ValidatorF
    @VisitF = VisitF

    @getDataset()

  getDataset: ->
    @DatasetF.getDatasets()
    .then (datasets) =>
      @datasets = datasets

  submit: ->
    if @edit
      @VisitF.editVisit(@data.visit_id, @data)
      .then =>
        @$uibModalInstance.close(true)
    else
      @VisitF.createVisit(@data)
      .then =>
        @$uibModalInstance.close(true)

  cancel: ->
    @$uibModalInstance.dismiss()

  pruneNA: (data) ->
    result = {}
    for k, v of data
      result[k] = if v is 'NA' then null else v
    return result

app.controller 'VisitEditC', VisitEditC
