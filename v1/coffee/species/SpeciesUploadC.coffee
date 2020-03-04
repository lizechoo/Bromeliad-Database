class SpeciesUploadC

  constructor: (SpeciesF, SpeciesUploadF, DialogF, $scope, HelpF) ->
    @SpeciesF = SpeciesF
    @SpeciesUploadF = SpeciesUploadF
    @DialogF = DialogF
    @$scope = $scope
    @HelpF = HelpF

    @stage = 0

  onUpload: (file) ->
    return unless file
    @counter = count: 0, duplicates: []

    @SpeciesUploadF.validateType file.type
    @SpeciesUploadF.validateSize file.size

    @SpeciesUploadF.validateFile file
    .then (count) =>
      @total = count
      @stage = 1
      return @uploadFile file
    .then (log_id) =>
      @stage = 2
      return @insertSpecies file, @counter, log_id

  getProgress: ->
    return {} unless @total
    return { 'width': (@counter.count / @total * 100) + '%' }

  insertSpecies: (file, counter, log_id) ->
    @SpeciesUploadF.uploadSpecies file, counter, log_id
    .then =>
      @stage = 3

  uploadFile: (file) ->
    @progress = 0
    @SpeciesUploadF.uploadFile file
    .then (file_id) =>
      @SpeciesUploadF.createSpeciesLog file_id

  getProgressClass: ->
    if @counter and @counter.duplicates and @counter.duplicates.length > 0
      return { "progress-bar-warning": true }
    else if @stage is 3
      return { "progress-bar-success": true }
    else
      return { "progress-bar-default": true }

  getStatusClass: (stage) ->
    if @stage is stage
      return current: true
    else if @stage > stage
      return complete: true
    else
      return pending: true

  getIconClass: (stage) ->
    if @stage is stage
      return 'fa-spin': true, 'fa-circle-o-notch': true
    else if stage is 2 and @stage is 3 and @counter?.duplicates?.length > 0
      return 'fa-times': true, 'font-red': true
    else
      return 'fa-check': true

  help: ->
    @HelpF.openHelp 'species-upload'

  cancel: ->
    if @stage > 0
      @DialogF.confirmDialog "Cancelling upload may cause data corruption. Proceed?"
      .then =>
        @$scope.closeThisDialog()

  finish: ->
    @$scope.confirm()

app.controller 'SpeciesUploadC', SpeciesUploadC
