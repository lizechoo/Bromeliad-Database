app.factory 'AvatarF', (ApiF, $q) ->
  AvatarF = {}

  AvatarF.SUPPORTED_TYPES = ['image/png', 'image/jpeg']

  AvatarF.getImageSrc = (file_id) ->
    return $q.when(null) unless file_id

    ApiF.get('files', 'info', params: file_id: file_id)
    .then (results) ->
      file = results.file
      "#{APP_CONST_PATH}files/#{file.unique_name}"

  AvatarF.getSrcPath = (filename) ->
    return null unless filename and filename.length > 0
    return "#{APP_CONST_PATH}files/#{filename}"

  return AvatarF
