class RecoverC
  constructor: (@token, @ngDialog, @UserF) ->
    @openDialog()

  openDialog: ->
    @ngDialog.openConfirm
      template: 'users/set-password.html'
      controller: 'UserPasswordC'
      controllerAs: 'user'
      resolve:
        onPasswordSet: =>
          (newPassword) =>
            @UserF.resetPassword(@token, newPassword)

app.controller 'RecoverC', RecoverC
