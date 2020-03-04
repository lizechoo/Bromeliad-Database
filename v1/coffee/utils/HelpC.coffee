class HelpC
  constructor: (type, MarkdownF, $uibModalInstance) ->
    @MarkdownF = MarkdownF
    @getMarkdown type
    @dismiss = $uibModalInstance.dismiss

  getMarkdown: (type) ->
    @MarkdownF.getMarkdown type
    .then (markdown) =>
      @markdown = markdown

app.controller 'HelpC', HelpC
