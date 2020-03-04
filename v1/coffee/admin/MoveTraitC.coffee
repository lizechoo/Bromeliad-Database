class MoveTraitC
  constructor: (SpeciesF, $scope, trait, traits) ->
    @SpeciesF = SpeciesF
    @$scope = $scope
    @trait = trait
    @traits =
      row.trait for row in traits when row.trait isnt trait

  submit: ->
    request = {}
    request[@trait] = {}

    if @order is 'front'
      request[@trait].after = 'species_id'
    else if @order is 'all'
      request[@trait].after = @traits[@traits.length - 1]
    else if @order is 'select'
      if @after not in @traits
        throw new Error "Select an existing trait to put new trait after"
      request[@trait].after = @after

    @SpeciesF.updateTachetTraits request
    .then =>
      @$scope.confirm()

app.controller 'MoveTraitC', MoveTraitC
