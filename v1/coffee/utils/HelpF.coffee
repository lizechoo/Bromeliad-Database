app.factory 'HelpF', ($uibModal) ->
  HelpF = {}

  HelpF.openHelp = (type) ->
    $uibModal.open
      templateUrl: 'help.html'
      controller: 'HelpC'
      controllerAs: 'help'
      resolve:
        type: -> type

  return HelpF
