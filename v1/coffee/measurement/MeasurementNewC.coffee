class MeasurementNewC
  constructor: (MeasurementF, SpeciesF, $uibModal, ngDialog, dataset_id, DatasetF, $uibModalInstance, existingSpecies) ->
    @MeasurementF = MeasurementF
    @SpeciesF = SpeciesF
    @$uibModal = $uibModal
    @species = []
    @existingSpecies = existingSpecies
    @ngDialog = ngDialog
    @dataset_id = dataset_id
    @$uibModalInstance = $uibModalInstance

  speciesAutoComplete: (bwg_name) ->
    @SpeciesF.loadSpeciesAutoComplete(bwg_name)

  onSpeciesSelect: (item) ->
    @k = ""
    @addSpecies item

  speciesSelector: ->
    modal = @$uibModal.open
      templateUrl: 'species/selector.html'
      controller: 'SpeciesSelectorC'
      controllerAs: 'species'
      size: 'lg'

    modal.result.then (species) =>
      @addSpecies species

  addSpecies: (species) ->
    if species.species_id in @existingSpecies
      throw new Error "Species was added to the dataset, please select another species"

    for s in @species
      if species.species_id is s.species_id
        throw new Error "Species already added, please select another species"

    newSpecies = angular.copy(species)
    @species.push newSpecies
    unless newSpecies.names
      @SpeciesF.loadSpeciesById(newSpecies.species_id)
      .then (s) =>
        newSpecies.names = s.names

  removeSpecies: (species) ->
    @species = (s for s in @species when species.species_id isnt s.species_id)

  submit: ->
    @$uibModalInstance.close @species
    # _parseValues = (values) ->
    #   for v in values
    #     if v.biomass? then value: v.text, biomass: v.biomass else v.text
    #
    # measurements = {}
    # for species in @species when species.values and species.values.length > 0
    #   values = _parseValues(species.values)
    #   measurements[species.species_id] =
    #     if species.category_range is 'Category'
    #       categories: values
    #     else if species.category_range is 'Range'
    #       ranges: values
    #     else
    #       throw new Error "Category/Range must be set for all measurements"
    #
    # if Object.keys(measurements).length is 0
    #   throw new Error "At least one species must be added"
    #
    # promise =
    #   if @edit
    #     @editMeasurements measurements
    #   else
    #     @createMeasurements measurements
    #
    # promise.then =>
    #
    # .catch (error) =>
    #   if typeof error is 'object' and error.status is 412
    #     @parse412Error error.message

  parse412Error: (message) ->
    _findSpecies = (species_id) =>
      for species in @species when species.species_id is species_id
        return species

    str = message.match /species_id:\ \d*/g
    if str and str.length > 0
      species_id = str[0].substring 12
      species = _findSpecies species_id
      throw new Error "Species <b>#{species.bwg_name}</b> already in measurements list"
    else throw new Error message

  createMeasurements: (measurements) ->
    @MeasurementF.createMeasurements @dataset_id, measurements

  editMeasurements: (measurements) ->
    @MeasurementF.editMeasurements @dataset_id, measurements

app.controller 'MeasurementNewC', MeasurementNewC
