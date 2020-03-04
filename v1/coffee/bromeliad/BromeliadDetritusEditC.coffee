class BromeliadDetritusEditC
  constructor: (detritus, $scope, BromeliadHelp) ->
    @BromeliadHelp = BromeliadHelp
    @$scope = $scope

    if not detritus or detritus.length is 0
      @detritus = detritus
      @addRow()
    else
      @detritus = detritus

  help: (section) =>
    console.log section
    @BromeliadHelp[section]

  addRow: ->
    @detritus.push min: '', max: '', mass: ''

  removeRow: (i) ->
    @detritus.splice i, 1

  done: ->
    @$scope.confirm @validateDetritus()

  isEmpty: (value) ->
    (not value or value.trim().length is 0)

  validateDetritus: ->
    return unless @detritus.length > 0

    lastMax = null

    removals = []
    for detritus, i in @detritus
      if @isEmpty(detritus.min) and @isEmpty(detritus.max) and @isEmpty(detritus.mass)
        removals.push i

    trimmedDetritus = []

    for detritus, i in @detritus
      unless i in removals
        trimmedDetritus.push detritus

    for detritus, i in trimmedDetritus
      if @isEmpty detritus.min
        unless i is 0
          throw new Error "<b>min</b> of a row must not be empty, unless it is the first row"

      if @isEmpty detritus.max
        unless i is @detritus.length - 1
          throw new Error "<b>max</b> of a row must not be empty, unless it is the last row"

      if not @isEmpty(detritus.min) and not @isEmpty(detritus.max)
        if parseInt(detritus.max) <= parseInt(detritus.min)
          throw new Error "<b>max</b> of a row cannot be smaller than the <b>min</b>"

      if @isEmpty detritus.mass
        throw new Error "<b>mass</b> is missing in a row"

      if lastMax?
        if detritus.min != lastMax
          throw new Error "<b>max</b> of a row must follow the <b>min</b> of the last row"

      lastMax = detritus.max

    return trimmedDetritus

app.controller 'BromeliadDetritusEditC', BromeliadDetritusEditC
