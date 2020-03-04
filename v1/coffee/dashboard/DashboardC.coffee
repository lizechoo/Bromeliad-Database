class DashboardC
  constructor: (DashboardF, MarkdownF, HistoryF) ->
    @DashboardF = DashboardF
    @MarkdownF = MarkdownF
    @HistoryF = HistoryF

    @getDashboardInfo()
    @getAnnouncements()
    @getHistory()

  getDashboardInfo: ->
    @DashboardF.getDashboardInfo()
    .then (results) =>
      @counts = results

  getAnnouncements: ->
    @MarkdownF.getMarkdown 'dashboard'
    .then (markdown) =>
      @announcements = markdown

  getHistory: ->
    @HistoryF.getHistory(page: 1, limit: 10, comments: true)
    .then (history) =>
      @history = history

app.controller('DashboardC', DashboardC)
