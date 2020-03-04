class MatrixOfflineC
  constructor: (MatrixOfflineF, matrix, bromeliads, DialogF, $scope, $q) ->
    @MatrixOfflineF = MatrixOfflineF
    @matrix = matrix
    @bromeliads = bromeliads
    @DialogF = DialogF
    @$scope = $scope
    @$q = $q

    if Object.keys(@matrix).length is 0
      throw new Error "Add at least 1 measurement to edit matrix"

    file = encodeURIComponent @getFile()
    @link = 'data:text/csv;charset=utf-8,' + file

  onUpload: (file) ->
    @MatrixOfflineF.validateType file.type

    @MatrixOfflineF.parseFile(file, @matrix, @bromeliads)
    .then (measurements) =>
      @$q.all [
        @$q.when(measurements)
        @DialogF.successDialog "Matrix has been replaced by the uploaded matrix. \
        <br>To apply these changes to the database, <br>click <b>Finish Editing</b>"
      ]
    .then ([measurements]) =>
      @$scope.confirm measurements

  getFile: ->
    @MatrixOfflineF.generateFile(@matrix, @bromeliads)

app.controller 'MatrixOfflineC', MatrixOfflineC
