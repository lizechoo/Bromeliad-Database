class DatasetMeasurementsC
  constructor: (DatasetF, MeasurementF, $stateParams, $uibModal, ngDialog, DialogF, SpeciesF) ->
    @measurements = {}

    @DatasetF = DatasetF
    @MeasurementF = MeasurementF
    @dataset_id = $stateParams.dataset_id
    @$uibModal = $uibModal
    @ngDialog = ngDialog
    @DialogF = DialogF
    @showSpecies = SpeciesF.showSpecies

    @loadMeasurements()

  loadMeasurements: ->
    @MeasurementF.getMeasurements(@dataset_id)
    .then (results) =>
      @measurements = results

  new: ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurement.<br> Save or discard them before adding new species"

    modal = @$uibModal.open
      templateUrl: 'measurements/new.html'
      controller: 'MeasurementNewC'
      controllerAs: 'measurement'
      resolve:
        dataset_id: => @dataset_id
        existingSpecies: => if @measurements then (m.species_id for m in @measurements) else []

    modal.result.then (added) =>
      if added and added.length > 0
        @newSpecies = angular.copy added
        for s in @newSpecies
          @newMeasurementRow s

  newMeasurementRow: (species) ->
    species.measurements ||= []
    if species.category_range is 'category'
      species.measurements.push { category: '', wet: false, biomass: '' }
    else if species.category_range is 'range'
      species.measurements.push { min: '', max: '', wet: false, biomass: '' }

  removeMeasurement: (species, ind) ->
    species.measurements.splice ind, 1
    if species.measurements.length is 0
      @newMeasurementRow species

  removeAddedSpecies: (species) ->
    @DialogF.confirmDialog "Measurements for <b>#{species.bwg_name}</b> will be discarded. Proceed?"
    .then =>
      for s, i in @newSpecies when species.species_id is s.species_id
        @newSpecies.splice i, 1

  discardNew: ->
    @DialogF.confirmDialog "Measurements for all added species will be discarded. Proceed?"
    .then =>
      @newSpecies = null

  saveNew: ->
    data = {}

    for species in @newSpecies
      omitted = @_omitEmptyMeasurements species.category_range, species.measurements
      if omitted.length is 0
        species.category_range = 'category'
        omitted = [category: 'default']
      species.measurements = omitted

      measurements = []

      # for range, check to see if both min, max and unit is present
      for m in species.measurements
        if species.category_range is 'range'
          if (not m.min or m.min.trim().length is 0)
            throw new Error "<b>min</b> missing for species <b>#{species.bwg_name}</b>"
          if (not m.max or m.max.trim().length is 0)
            throw new Error "<b>max</b> missing for species <b>#{species.bwg_name}</b>"
          if (not m.unit or m.unit.trim().length is 0)
            throw new Error "<b>unit</b> missing for species <b>#{species.bwg_name}</b>"

          mObj = min: m.min, max: m.max, unit: m.unit
        else
          mObj = value: m.category

        if m.biomass and m.biomass.trim().length > 0
          mObj.biomass = value: m.biomass, unit: species.unit, dry_wet: if m.wet then 'wet' else 'dry'

        measurements.push mObj

      if species.category_range is 'range'
        data[species.species_id] = ranges: measurements
      else
        data[species.species_id] = categories: measurements

    @MeasurementF.createMeasurements @dataset_id, data
    .then =>
      @newSpecies = null
      @DialogF.successDialog "Species successfully added to the dataset"
    .then =>
      @loadMeasurements()

  _omitEmptyMeasurements: (category_range, measurements) ->
    removals = []

    for m, i in measurements
      if category_range is 'category'
        if not m.category or m.category.trim().length is 0
          removals.push i
      if category_range is 'range'
        if (not m.min or m.min.trim().length is 0) and (not m.max or m.max.trim().length is 0)
          removals.push i

    return (m for m, i in measurements when i not in removals)

  edit: (category, measurement) ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurements.<br> Save or discard them before editing existing measurements"

    @ngDialog.openConfirm
      templateUrl: 'measurements/edit.html'
      controller: 'MeasurementEditC'
      controllerAs: 'measurement'
      resolve:
        category: => category
        measurement: => angular.copy measurement
    .then =>
      @DialogF.successDialog "Measurement successfully updated"
    .then =>
      @loadMeasurements()

  # add a measurement row to an existing species
  addMeasurement: (category, species_id) ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurements.<br> Save or discard them before editing existing measurements"

    @ngDialog.openConfirm
      templateUrl: 'measurements/edit.html'
      controller: 'MeasurementEditC'
      controllerAs: 'measurement'
      resolve:
        category: => category
        measurement: => add: true, species_id: species_id, dataset_id: @dataset_id
    .then =>
      @DialogF.successDialog "Measurement successfully added"
    .then =>
      @loadMeasurements()

  deleteMeasurement: (measurement_id) ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurements.<br> Save or discard them before removing existing measurements"

    @DialogF.confirmDialog "Measurement and <b>ALL</b> associated abundance counts will be deleted. Proceed?"
    .then =>
      @MeasurementF.removeMeasurementById measurement_id
    .then =>
      @DialogF.successDialog "Measurement successfully deleted"
    .then =>
      @loadMeasurements()

  remove: (species) ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurements.<br> Save or discard them before removing existing species"

    @DialogF.confirmDialog "Measurements for <b>#{species.bwg_name}</b> will be \
    deleted. Proceed?"
    .then =>
      @MeasurementF.removeMeasurements(@dataset_id, species.species_id)
    .then =>
      @loadMeasurements()
      @DialogF.successDialog "Measurements for <b>#{species.bwg_name}</b> \
      successfully deleted"

  removeAll: ->
    if @newSpecies and @newSpecies.length > 0
      throw new Error "There are unsaved species measurements.<br> Save or discard them before removing existing species"

    @DialogF.confirmDialog "All measurements and <b>ALL</b> associated abundance counts will be removed. Proceed?"
    .then =>
      @MeasurementF.removeMeasurements(@dataset_id)
    .then =>
      @loadMeasurements()
      @DialogF.successDialog "All measurements successfully removed"

app.controller 'DatasetMeasurementsC', DatasetMeasurementsC
