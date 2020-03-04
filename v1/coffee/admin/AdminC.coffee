class AdminC
  constructor: (AdminF, $state) ->
    @AdminF = AdminF
    @$state = $state

  newUser: ->
    @AdminF.newUser()

app.controller 'AdminC', AdminC
