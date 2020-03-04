app.directive 'uploader', () ->
  restrict: 'E'
  templateUrl: 'utils/uploader.html'
  scope:
    onUpload: '&'
  link: (scope, element, attrs) ->
    _getDropzone = ->
      dropzone || element.find '.uploader'

    _getDataTransfer = (event) ->
      dataTransfer = null
      return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer

    resetFileInput = (e) ->
      e.wrap('<form>').closest('form').get(0).reset()
      e.unwrap

      if e.stopPropagation
        e.stopPropagation()
      if e.preventDefault
        e.preventDefault()

    handleFile = (file) ->
      scope.$apply ->
        scope.onUpload(file: file)

    processDrag = (event) ->
      dropzone = _getDropzone()
      if event
        dropzone.addClass 'uploader-hover'
        if event.preventDefault
          event.preventDefault()
        if event.stopPropagation
          return false

      _getDataTransfer(event).effectAllowed = 'copy'
      return false

    $('.uploader').click ->
      $('.uploader-input').click()

    $('.uploader-input').on 'change', (event) ->
      if $('.uploader-input')[0]?.files?[0]
        handleFile $('.uploader-input')[0].files[0]
        resetFileInput $('.uploader-input')

    dropzone = _getDropzone()

    dropzone.bind 'dragover', processDrag
    dropzone.bind 'dragenter', processDrag
    dropzone.bind 'dragleave', ->
      dropzone.removeClass 'uploader-hover'
    dropzone.bind 'drop', (event) ->
      if event?
        event.preventDefault()
      dropzone.removeClass 'uploader-hover'

      file = _getDataTransfer(event).files[0]
      handleFile file
      return false
