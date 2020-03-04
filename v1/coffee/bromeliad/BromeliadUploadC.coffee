class BromeliadUploadC
  constructor: (visit_id, BromeliadF, BromeliadUploadF, $scope, DialogF, HelpF) ->
    @BromeliadF = BromeliadF
    @BromeliadUploadF = BromeliadUploadF
    @$scope = $scope
    @DialogF = DialogF
    @HelpF = HelpF

    @visit_id = visit_id

  onUpload: (file) ->
    return unless file

    @BromeliadUploadF.validateType file.type
    @BromeliadUploadF.validateSize file.size

    @BromeliadUploadF.validateFile file
    .then (bromeliads) =>
      for bromeliad in bromeliads
        bromeliad.visit_id = @visit_id

      @BromeliadF.createBromeliads bromeliads
    .then =>
      @DialogF.successDialog "Bromeliads successfully created"
    .then =>
      @$scope.confirm(true)

  help: ->
    @HelpF.openHelp 'bromeliad-upload'

app.controller 'BromeliadUploadC', BromeliadUploadC
