class NewTachetC
  constructor: (SpeciesF, DialogF, traits, $scope) ->
    @SpeciesF = SpeciesF
    @DialogF = DialogF
    @traits = traits
    @$scope = $scope

  submit: ->
    request = {}
    if (not @data) || (not @data.trait) || @data.trait.trim().length is 0
      throw new Error "Trait field is required"
    trait = @data.trait
    request[trait] = {}
    if @data.description && @data.description.trim().length isnt 0
      request[trait].description = @data.description
    if @order is 'front'
      request[trait].after = 'species_id'
    else if @order is 'select'
      if @after not in (k.trait for k in @traits)
        throw new Error "Select an existing trait to put new trait after"
      request[trait].after = @after

    @SpeciesF.createTachetTrait request
    .then =>
      @$scope.confirm()

app.controller 'NewTachetC', NewTachetC
