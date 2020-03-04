class HistoryC
  constructor: (HistoryF) ->
    @HistoryF = HistoryF
    @loadHistory()

  loadHistory: ->
    @HistoryF.getHistory(comments: true)
    .then (logs) =>
      @data = logs

  onSubmitComment: (log_id, comment) =>
    @HistoryF.leaveComment log_id, comment
    .then =>
      @loadHistory()

app.controller 'HistoryC', HistoryC
