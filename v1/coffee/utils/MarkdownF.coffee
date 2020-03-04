app.factory 'MarkdownF', (ApiF, ngDialog) ->
  MarkdownF = {}
  MarkdownF.MAX_SIZE_MB = 10
  MarkdownF.SUPPORTED_TYPES = ['image/jpeg', 'image/png']

  MarkdownF.markdowns = [
    { type: 'dashboard', title: 'Announcements' }
    { type: 'species-upload', title: 'Species Upload' }
    { type: 'bromeliad-upload', title: 'Bromeliad Upload' }
  ]

  MarkdownF.getMarkdown = (type) ->
    ApiF.get('markdowns', 'list', params: type: type)
    .then ([markdown]) ->
      markdown.markdown

  MarkdownF.updateMarkdown = (type, markdown) ->
    ApiF.postWithLoading('markdowns', 'edit', null, (type: type, markdown: markdown))

  MarkdownF.uploadDialog = ->
    ngDialog.openConfirm
      template: 'admin/uploadImage.html'
      controller: 'AdminMarkdownUploadC'
      controllerAs: 'admin'

  MarkdownF.validateType = (type) ->
    unless type in MarkdownF.SUPPORTED_TYPES
      throw new Error "File type not supported. Please select a JPEG or PNG file."

  MarkdownF.validateSize = (size) ->
    if size > (MarkdownF.MAX_BYTE_SIZE * 1024 * 1024)
      throw new Error "File size exceeded 10MB"

  MarkdownF.uploadFile = (file) ->
    formData = new FormData()
    formData.append 'file', file

    options =
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }

    ApiF.post('markdowns', 'upload', options, formData)
    .then (results) ->
      results.unique_name

  return MarkdownF
