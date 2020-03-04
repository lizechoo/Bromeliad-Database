class MainC
  constructor: (UserF, HelpMessageF, ngDialog, AvatarF, $window) ->
    @UserF = UserF
    @AvatarF = AvatarF
    @$window = $window

    @loadUser = ->
      UserF.getUser()
      .then (user) =>
        @user = user

    @logout = ->
      UserF.logout()

    @setPassword = ->
      ngDialog.openConfirm
        template: 'users/set-password.html'
        controller: 'UserPasswordC'
        controllerAs: 'user'
        resolve:
          onPasswordSet: -> null

    HelpMessageF.fetchHelp()
    .then =>
      @loadUser()
    .then (user) =>
      if user?.avatar
        @loadUserImage user.avatar

  setAvatar: ->
    @UserF.setAvatar()
    .then =>
      @$window.location.reload()

  loadUserImage: (file_id) ->
    @AvatarF.getImageSrc file_id
    .then (path) =>
      @userImage = path

angular
.module 'app'
.controller('MainC', MainC)
