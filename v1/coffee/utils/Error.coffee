app.config ($provide) ->
  $provide.decorator "$exceptionHandler",
  ($delegate, $injector) ->
    (exception, cause) ->
      ngDialog = $injector.get "ngDialog"
      ngDialog.open
        template: 'errorDialog.html'
        controller: ErrorC
        resolve:
          message: -> exception.message
      console.error exception, cause

ErrorC = ($scope, message) ->
  $scope.message = message
