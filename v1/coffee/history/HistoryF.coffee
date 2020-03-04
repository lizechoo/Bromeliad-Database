app.factory 'HistoryF', (ApiF) ->
  HistoryF = {}
  MINUTE = 60
  HOUR = MINUTE * 60
  DAY = HOUR * 24

  HistoryF.getHistory = (params = {}) ->
    options = params: params
    ApiF.get('logs', 'list', options)
    .then (results) ->
      return results.logs

  HistoryF.getDatasetInfo = (log) ->
    return null unless log.type in ['matrix', 'visits', 'bromeliads', 'measurements']

    return null unless log[log.type] and log[log.type].length > 0
    if log[log.type].length is 1
      return dataset_id: log[log.type][0].dataset_id, dataset_name: log[log.type][0].dataset_name
    else
      return num_datasets: log[log.type].length

  HistoryF.leaveComment = (log_id, comment) ->
    ApiF.post('logs', 'comment', {params: log_id: log_id}, comment: comment)

  HistoryF.parseAction = (action) ->
    switch action
      when 'create' then return 'added'
      when 'edit' then return 'updated'
      when 'delete' then return 'removed'

  HistoryF.parseTime = (timestamp) ->
    [date, time] = timestamp.split(" ")
    [y, m, d] = date.split("-")
    [h, mi ,s] = time.split(":")

    date = new Date(y, m - 1, d, h, mi, s)
    current = new Date()
    diff = Math.floor((current.getTime() - date.getTime()) / 1000)

    if (diff < MINUTE)
      return "#{diff} seconds ago"

    if (diff < HOUR)
      minutes = Math.floor(diff/60)
      return "#{minutes} minutes ago"

    if (diff < DAY)
      hours = Math.floor(diff/60/60)
      return "#{hours} hours ago"

    days = Math.floor(diff/60/60/24)
    return "#{days} days ago"

  return HistoryF
