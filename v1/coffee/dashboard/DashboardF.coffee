app.factory 'DashboardF', (ApiF) ->
  DashboardF = {}

  DashboardF.getDashboardInfo = ->
    ApiF.get 'dashboard', 'summary'

  return DashboardF
