app.factory 'DialogF', (ngDialog) ->
  DialogF = {}
  DialogF.successDialog = (message) ->
    ngDialog.openConfirm
      template: 'successDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: -> message

  DialogF.confirmDialog = (message) ->
    ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: -> message

  DialogF.loadingDialog = (promise) ->
    ngDialog.openConfirm
      template: 'loading.html'
      controller: ($scope) =>
        promise.then (results) =>
          $scope.confirm(results)
        , (reason) =>
          $scope.closeThisDialog(reason)

  return DialogF
