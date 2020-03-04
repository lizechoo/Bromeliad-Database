class AdminTachetC
  constructor: (SpeciesF, DialogF, ngDialog) ->
    @SpeciesF = SpeciesF
    @DialogF = DialogF
    @ngDialog = ngDialog
    @loadTachetTraits()

  loadTachetTraits: ->
    @SpeciesF.loadTachetTraits()
    .then (data) =>
      @traits = data.traits

  deleteTrait: (trait) ->
    @DialogF.confirmDialog "Trait <b>#{trait}</b> will be removed. Proceed?"
    .then =>
      @SpeciesF.deleteTrait(trait)
    .then =>
      @loadTachetTraits()

  newTrait: ->
    @ngDialog.openConfirm
      template: 'admin/newTachet.html'
      controller: 'NewTachetC'
      controllerAs: 'admin'
      resolve:
        traits: => @traits
    .then =>
      @DialogF.successDialog "Trait added successfully"
    .then =>
      @loadTachetTraits()

  updateDescriptions: ->
    @DialogF.confirmDialog "Trait descriptions will be updated. Proceed?"
    .then =>
      data = @descriptionData()
      @SpeciesF.updateTachetTraits data
    .then =>
      @DialogF.successDialog "Descriptions updated successfully"
    .then =>
      @loadTachetTraits()

  moveTrait: (trait) ->
    @ngDialog.openConfirm
      template: 'admin/moveTrait.html'
      controller: 'MoveTraitC'
      controllerAs: 'admin'
      resolve:
        trait: => trait
        traits: => @traits
    .then =>
      @DialogF.successDialog "Trait moved successfully"
    .then =>
      @loadTachetTraits()

  descriptionData: ->
    results = {}
    for trait in @traits
      results[trait.trait] = description: trait.description
    return results

  hasTraits: ->
    return false unless @traits
    Object.keys(@traits).length > 0

app.controller 'AdminTachetC', AdminTachetC
