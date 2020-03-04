dependencies = ['ui.router', 'ngTable', 'ngTableExport', 'ui.bootstrap',
  'ngTagsInput', 'LocalStorageModule', 'templates', 'ngDialog', 'capitalFilter',
  'ngSanitize', 'truncate', 'hc.marked', 'angular-loading-bar']

app = angular.module('app', dependencies);

app.config ['markedProvider', (markedProvider) ->
  markedProvider.setOptions
    gfm: true
  ]

angular.module 'capitalFilter', []
.filter 'capital', ->
  (input) ->
    return if !input
    return input[0].toUpperCase() + input.substr(1)
