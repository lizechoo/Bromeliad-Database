app.factory 'HelpMessageF', (ConstantsF, $http, $q) ->
  HelpMessageF = {}

  _cache = null

  HelpMessageF.fetchHelp = ->
    $http.get("#{ConstantsF.API_PATH}/help.json")
    .then (res) ->
      _cache = res.data
    .catch (err) ->
      throw new Error err

  HelpMessageF.getHelp = (area, button) ->
    return _cache?[area]?[button]

  HelpMessageF
