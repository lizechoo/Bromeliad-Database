class ConfirmC
  constructor: ($scope, message, doubleConfirm) ->
    $scope.message = message
    $scope.doubleConfirm = doubleConfirm

app.controller 'ConfirmC', ConfirmC
