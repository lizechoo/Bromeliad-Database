app.factory 'UserF', (LocalStorageF, ConstantsF, ngDialog, $window, $http, $q, $state) ->
  UserF = {}

  UserF.GET_USER_API = ConstantsF.getPath 'users', 'current'
  UserF.LOGIN_USER_API = ConstantsF.getPath 'users', 'login'
  UserF.RESET_API = ConstantsF.getPath 'users', 'reset'
  UserF.RECOVER_API = ConstantsF.getPath 'users', 'recover'

  UserF.getUser = ->
    return $q.when UserF.user if UserF.user
    return UserF.signIn()

  UserF.header = ->
    return if !UserF.token
    return 'Authorization': 'bearer ' + UserF.token

  UserF.signIn = ->
    if !UserF.token
      UserF.token = LocalStorageF.token.get()
      if !UserF.token
        UserF.showLogin()
        return $q.reject()
    return UserF.loadUser UserF.token

  UserF.loadUser = (token) ->
    options = headers: 'Authorization': "bearer #{token}"
    return $http.get UserF.GET_USER_API, options
    .then (res) ->
      user = res.data.results.user
      UserF.setUser user
      return user
    ,(error) ->
      UserF.token = null
      LocalStorageF.token.unset()
      $window.location.reload()

  UserF.setUser = (user) ->
    UserF.user = user

  UserF.showLogin = ->
    ngDialog.open
      template: 'loginDialog.html'
      controller: 'LoginDialogC'
      showClose: false
      closeByEscape: false
      closeByDocument: false

  UserF.setAvatar = ->
    ngDialog.openConfirm
      template: 'users/avatar.html'
      controller: 'UserAvatarC'
      controllerAs: 'user'

  UserF.sendRecoveryEmail = (email) ->
    $http.post(UserF.RECOVER_API, email: email)

  UserF.resetPassword = (token, password) ->
    data =
      token: token
      password: password

    $http.post(UserF.RESET_API, data)
    .catch (res) ->
      throw new Error res?.data.error

  UserF.login = (username, password) ->
    data =
      username: username
      password: password

    return $http.post(UserF.LOGIN_USER_API, data)
    .then (res) ->
      unless res?.data?.results?.token
        console.error "Cannot find token from response: ", JSON.stringify(res)

      UserF.token = token = res.data.results.token
      LocalStorageF.token.set(token)
      return true

  UserF.logout = ->
    delete UserF.user
    delete UserF.token
    LocalStorageF.token.unset()
    $state.go('dashboard')
    .then ->
      $window.location.reload()

  return UserF
