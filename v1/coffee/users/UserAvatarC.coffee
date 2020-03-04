class UserAvatarC
  constructor: (ApiF, $scope, DialogF, AvatarF) ->
    @ApiF = ApiF
    @DialogF = DialogF
    @AvatarF = AvatarF
    @confirm = $scope.confirm

  onUpload: (file) ->
    unless file.type in @AvatarF.SUPPORTED_TYPES
      throw new Error "Only .png or .jpg images are allowed. Sorry no GIFs"

    formData = new FormData()
    formData.append 'file', file

    options =
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }

    @ApiF.post('users', 'upload', options, formData)
    .then (results) =>
      @file_id = results.file_id
      @previewAvatar results.unique_name

  previewAvatar: (unique_name) ->
    @preview = "#{APP_CONST_PATH}files/#{unique_name}"

  setAvatar: ->
    return unless @file_id
    @ApiF.post('users', 'avatar', params: file_id: @file_id, { "upload": true })
    .then (results) =>
      @DialogF.successDialog "Your profile picture has been updated"
    .then =>
      @confirm()

app.controller 'UserAvatarC', UserAvatarC
