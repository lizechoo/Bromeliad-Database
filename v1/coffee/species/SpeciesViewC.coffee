class SpeciesViewC
  constructor: (species_id, SpeciesF, $uibModalInstance) ->
    @SpeciesF = SpeciesF
    @$uibModalInstance = $uibModalInstance
    @loadSpecies species_id
    @loadDataset species_id
    @loadTachet()

  loadTachet: ->
    @SpeciesF.loadTachetTraits()
    .then (results) =>
      @tachets = {}
      for trait in results.traits
        @tachets[trait.trait] = trait.description

  loadSpecies: (species_id) ->
    @SpeciesF.loadSpeciesById species_id
    .then (species) =>
      @data = species

  loadDataset: (species_id) ->
    @SpeciesF.getDataset species_id
    .then (datasets) =>
      console.log datasets
      @datasets = datasets

  dismiss: ->
    @$uibModalInstance.dismiss()

app.controller 'SpeciesViewC', SpeciesViewC
