class AdminMarkdownUploadC
  constructor: (MarkdownF, $scope) ->
    @MarkdownF = MarkdownF
    @$scope = $scope

  onUpload: (file) ->
    return unless file

    @MarkdownF.validateType file.type
    @MarkdownF.validateSize file.size

    @MarkdownF.uploadFile file
    .then (unique_name) =>
      @$scope.confirm unique_name

app.controller 'AdminMarkdownUploadC', AdminMarkdownUploadC
