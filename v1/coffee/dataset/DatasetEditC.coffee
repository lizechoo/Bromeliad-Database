class DatasetEditC
  constructor: (edit, DatasetF, $uibModalInstance, ConstantsF) ->
    @COUNTRIES = ConstantsF.COUNTRIES

    if edit?
      @data = edit
      @edit = true
    @DatasetF = DatasetF
    @$uibModalInstance = $uibModalInstance

  submit: ->
    if @edit
      @DatasetF.editDataset(@data.dataset_id, @data)
      .then =>
        @$uibModalInstance.close(true)
    else
      @DatasetF.createDataset(@data)
      .then =>
        @$uibModalInstance.close(true)

  cancel: ->
    @$uibModalInstance.dismiss()

app.controller 'DatasetEditC', DatasetEditC
