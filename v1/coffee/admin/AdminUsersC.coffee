class AdminUsersC
  constructor: (AdminF, DialogF) ->
    @AdminF = AdminF
    @DialogF = DialogF

    @loadUsers()

  loadUsers: ->
    @AdminF.loadUsersList()

  getInitials: (name) ->
    parts = name.split(" ")
    initial = ""
    for part in parts
      initial += part[0]
    return initial.toUpperCase()

  delete: (username) ->
    @DialogF.confirmDialog "User <b>#{username}</b> will be deleted. Proceed?"
    .then =>
      @AdminF.deleteUser username
    .then =>
      @DialogF.successDialog "User successfully deleted"

  editUser: (user) ->
    @AdminF.editUser user

  getAvatar: (user) ->
    return null unless user.avatar_link
    return user.avatar_link

app.controller 'AdminUsersC', AdminUsersC
