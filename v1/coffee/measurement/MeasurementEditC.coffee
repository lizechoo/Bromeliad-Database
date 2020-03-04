class MeasurementEditC
  constructor: (category, measurement, MeasurementF, DialogF, $scope) ->
    @category = category
    if measurement?.add
      @add = true
      @data =
        biomass:
          unit: 'mg', dry_wet: 'dry'
      @dataset_id = measurement.dataset_id
      @species_id = measurement.species_id
    else
      @data = measurement
      if !@data.biomass
        @data.biomass = unit:'mg', dry_wet:'dry'
      @add = false
    @MeasurementF = MeasurementF
    @DialogF = DialogF
    @$scope = $scope

  submit: ->
    if @add
      addObj = @formatAddObj @data
      speciesObj = {}
      speciesObj[@species_id] = addObj
      @MeasurementF.createMeasurements @dataset_id, speciesObj
      .then =>
        @$scope.confirm()
    else
      editObj = @formatEditObj @data
      console.log editObj
      @MeasurementF.editMeasurement @data.measurement_id, editObj
      .then =>
        @$scope.confirm()

  formatAddObj: (data) ->
    obj = {}
    mObj = {}

    if @category
      mObj = value: data.value
    else
      mObj = min: data.min, max: data.max, unit: data.unit

    if data.biomass and data.biomass.value?.length > 0 and data.biomass.value != 'NA'
      mObj.biomass = data.biomass

    if @category
      obj.categories = [mObj]
    else
      obj.ranges = [mObj]

    return obj

  formatEditObj: (data) ->
    obj = {}

    if @category
      obj.value = data.value
    else
      obj = min: data.min, max: data.max, unit: data.unit

    if data.biomass and data.biomass.value?.length > 0 and data.biomass.value != 'NA'
      obj.biomass = data.biomass

    return obj

app.controller 'MeasurementEditC', MeasurementEditC
