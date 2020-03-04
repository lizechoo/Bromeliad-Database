class UserPasswordC
  constructor: (AdminF, $scope, DialogF, @onPasswordSet, @$state, @LocalStorageF, @$timeout, @$window) ->
    @AdminF = AdminF
    @$scope = $scope
    @DialogF = DialogF

  submit: ->
    unless @password
      throw new Error "Enter a password"
    unless @confirm
      throw new Error "Enter confirm password"
    unless @password is @confirm
      throw new Error "Password and confirm password do not match"

    if @onPasswordSet?
      p = @onPasswordSet(@password)
    else
      p = @AdminF.updatePassword(@password)
    p.then =>
      @DialogF.successDialog "New password successfully set"

    if @onPasswordSet?
      p.then =>
        @LocalStorageF.token.unset()
        @$timeout =>
          @$state.go('dashboard')
          .then =>
            @$timeout =>
              @$window.location.reload()
            , 500
        , 500
    else
      p.then =>
        @$scope.closeThisDialog()

app.controller 'UserPasswordC', UserPasswordC
