app.factory 'AdminF', (ApiF, ngDialog, UserF, AvatarF, $q) ->
  AdminF = {}

  AdminF.usersList = []

  AdminF.loadUsersList = ->
    ApiF.get('users', 'all', null)
    .then (results) ->
      AdminF.usersList = results.users

      promises = []
      for user in AdminF.usersList
        promise = AvatarF.getImageSrc user.avatar
        promises.push promise

      $q.all promises
    .then (results) ->
      for link, i in results
        AdminF.usersList[i].avatar_link = link

  AdminF.newUser = ->
    ngDialog.openConfirm
      template: 'users/edit.html'
      controller: 'UserEditC'
      controllerAs: 'user'
      resolve:
        edit: -> null

  AdminF.editUser = (user) ->
    ngDialog.openConfirm
      template: 'users/edit.html'
      controller: 'UserEditC'
      controllerAs: 'user'
      resolve:
        edit: -> angular.copy user

  AdminF.createUser = (user) ->
    ApiF.post('users', 'create', null, user)
    .then ->
      AdminF.loadUsersList()

  AdminF.updateUser = (user) ->
    ApiF.post('users', 'edit', null, user)
    .then ->
      AdminF.loadUsersList()

  AdminF.deleteUser = (username) ->
    ApiF.post('users', 'delete', null, username: username)
    .then (res) ->
      AdminF.loadUsersList()

  AdminF.updatePassword = (password) ->
    username = UserF.user.username
    data =
      username: username
      password: password
    ApiF.post('users', 'edit', null, data)

  return AdminF
