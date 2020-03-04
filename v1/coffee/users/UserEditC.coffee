class UserEditC
  constructor: (AdminF, $scope, DialogF, edit) ->
    @AdminF = AdminF
    @$scope = $scope
    @DialogF = DialogF

    if edit?
      @edit = true
      @data = edit
      if edit.role is 'admin'
        @data.admin = true
      else
        @data.admin = false

  submit: (user) ->
    data =
      name: user.name
      username: user.username
      email: user.email
      role: if user.admin then 'admin' else 'user'

    if (not @edit?) or @setPassword
      if user.password != user.confirm
        throw new Error "Password and confirm password do not match"
      data.password = user.password

    if @edit?
      @AdminF.updateUser(data)
      .then =>
        @DialogF.successDialog "User successfully updated"
      .then =>
        @$scope.closeThisDialog()
    else
      @AdminF.createUser(data)
      .then =>
        @DialogF.successDialog "User successfully created"
      .then =>
        @$scope.closeThisDialog()

app.controller 'UserEditC', UserEditC
