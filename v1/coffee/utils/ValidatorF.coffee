app.factory 'ValidatorF', ->
  ValidatorF = {}

  ValidatorF.validateDate = (title, value) ->
    return unless value and value.length > 0
    parts = value.split('-')
    if parts.length isnt 3
      throw new Error "#{title} must be in the format of YYYY-MM-DD"
    [year, month, date] = parts
    if isNaN parts[0]
      throw new Error "#{title}'s year must be a number"
    if isNaN parts[1]
      throw new Error "#{title}'s month must be a number"
    if isNaN parts[2]
      throw new Error "#{title}'s date must be a number"
    if year < 1900 or year > 2100
      throw new Error "#{title}'s year must be after 1900 and before 2100"
    if month < 1 or month > 12
      throw new Error "#{title}'s month is invalid"
    if date < 1
      throw new Error "#{title}'s date is invalid"
    if parseInt(month) in [1,3,5,7,8,10,12] and date > 31
      throw new Error "#{title}'s date is invalid for the month"
    if parseInt(month) in [4,6,9,11] and date > 30
      throw new Error "#{title}'s date is invalid for the month"
    if parseInt(month) is 2 and date > 29
      throw new Error "#{title}'s date is invalid for the month"

  ValidatorF.validateNumber = (title, value, allowNA = false) ->
    return if allowNA and value is 'NA'
    return unless value and value.length > 0
    if isNaN(num = parseFloat(value))
      throw new Error "#{title} must be a number"

  ValidatorF.validateLat = (title, value) ->
    return unless value and value.length > 0
    if isNaN value
      throw new Error "Latitude must be a number"
    if value < -90 or value > 90
      throw new Error "Latitude must be between -90 to 90"

  ValidatorF.validateLng = (title, value) ->
    return unless value and value.length > 0
    if isNaN value
      throw new Error "Longitude must be a number"
    if value < -180 or value > 180
      throw new Error "Longitude must be between -180 to 180"

  return ValidatorF
