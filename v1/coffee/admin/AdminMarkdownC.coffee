class AdminMarkdownC
  constructor: (MarkdownF, DialogF) ->
    @MarkdownF = MarkdownF
    @markdowns = MarkdownF.markdowns
    @DialogF = DialogF

    @uneditedMarkdown = null
    @article = null
    @view = 'write'

  showMarkdown: (type) ->
    if @article? and @uneditedMarkdown isnt @markdown
      @DialogF.confirmDialog "There are unsaved changes in the editing article. Proceed?"
      .then =>
        @getMarkdown type
    else
      @getMarkdown type

  getMarkdown: (type) ->
    @MarkdownF.getMarkdown type
    .then (markdown) =>
      @article = type
      @view = 'write'
      @uneditedMarkdown = angular.copy markdown
      @markdown = markdown

  appendImage: (unique_name) ->
    @markdown += "\n\n"
    @markdown += "![Uploaded Image](#{APP_CONST_PATH}files/#{unique_name})\n\n"

  uploadImage: ->
    @MarkdownF.uploadDialog()
    .then (unique_name) =>
      @appendImage unique_name

  save: ->
    @MarkdownF.updateMarkdown @article, @markdown
    .then =>
      @DialogF.successDialog "Article successfully saved"

app.controller 'AdminMarkdownC', AdminMarkdownC
