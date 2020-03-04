class LoginDialogC
  constructor: (UserF, $scope, $window, $q, DialogF) ->
    $scope.submit = (username, password) ->
      $scope.error = null
      $scope.loggingIn = true
      UserF.login(username, password)
        .catch (res) =>
          $scope.loggingIn = false
          data = res.data
          throw new Error 'Unknown error signing in' unless data?.error
          $scope.error = data.error
          return $q.reject()
        .then (success) =>
          $scope.loggingIn = false
          if success
            $scope.closeThisDialog()
            $window.location.reload()

    $scope.forget = (email) ->
      UserF.sendRecoveryEmail(email)
      .then ->
        DialogF.successDialog("Check your mailbox for a password recovery link")
      .catch (res) ->
        throw new Error res?.data?.error

app.controller 'LoginDialogC', LoginDialogC
