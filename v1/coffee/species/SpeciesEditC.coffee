class SpeciesEditC
  constructor: (SpeciesTableF, SpeciesF, ngDialog, edit, $q, $state, $window, $rootScope, $anchorScroll, $location) ->
    @SpeciesF = SpeciesF

    # loaded species if edit
    @species = {}

    # species field values
    @data = {} # { field: { value: 'somevalue', error: null | "errorMsg" } }
    @names = [] # [{ text: 'name1', text: "name2" ... }]
    @traits = [] # [{ type1: 'value1', type2: "value2" ... }]
    @tachet = {} # [{ BD1: 'value1', ...}]

    @newTrait =
      type: '', value: ''

    @editing = {}

    @classificationColumns = @SpeciesF.classificationColumns
    @ngDialog = ngDialog
    @$state = $state
    @$q = $q
    @$window = $window
    @$anchorScroll = $anchorScroll
    @$location = $location

    @getTachetTraits()
    .then =>
      if edit?
        @edit = edit
        @loadSpecies(edit)
        .then (species) =>
          @species = species
          @populateSpecies species

  getTachetTraits: ->
    @SpeciesF.loadTachetTraits()
    .then (results) =>
      @tachetList = results.traits

  successDialog: ->
    action = if @edit then 'edited' else 'created'

    @ngDialog.openConfirm
      template: 'successDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: -> "Species #{action} successfully"

  resetDialog: ->
    @ngDialog.openConfirm
      template: 'confirmDialog.html'
      controller: 'ConfirmC'
      resolve:
        doubleConfirm: -> null
        message: -> "All your changes will be reset. Proceed?"

  back: ->
    @$window.history.back()

  addTrait: (type, value) ->
    for trait in @traits
      if trait.type is type
        throw new Error "Trait #{type} already exists"
    @traits.push type: type, value: value
    @newTrait = type: '', value: ''

  newTraitEntry: ->
    @traits.push type: '', value: ''
    @$location.hash('new')
    @$anchorScroll()

  removeTrait: (index) ->
    @traits.splice index, 1

  resetTraits: ->
    @populateTraits(@species.traits)

  resetNames: ->
    @populateNames(@species.names)

  traitSuggestions: (type) ->
    return @SpeciesF.loadTraitSuggestions(type)

  reset: ->
    @resetDialog()
    .then =>
      @populateSpecies @species

  resetField: (field) ->
    if @edit and @species[field]
      @data[field].value = @species[field]
      @editing[field] = false
    else
      @data[field].value = "" if @data[field]?.value

  submit: ->
    # prepare species
    species = {}
    for k, v of @data when v
      species[k] = v.value

    species.names = []
    for nameObj in @names
      species.names.push nameObj.text

    species.traits = {}
    for trait in @traits when trait.type and trait.type.length > 0
      species.traits[trait.type] = trait.value

    species.tachet = angular.copy @tachet

    @SpeciesF.validateTraits species.traits

    if @edit?
      species_id = @edit
      @editSpecies(species)
      .then =>
        @successDialog().then =>
          @$state.reload()
        return
    else
      @insertSpecies(species)
      .then (species_id) =>
        @successDialog().then =>
          @$state.go('species-edit', id: species_id)
        return

  editSpecies: (species) ->
    @SpeciesF.editSpecies(@edit, species)

  insertSpecies: (species) ->
    @SpeciesF.createSpecies(species)
    .then ([inserted, duplicates]) =>
      inserted[0]

  # compares form data with loaded species, return true if edited
  isEdited: (field) ->
    return false unless @edit?
    formValue = @data?[field]?.value
    if formValue is ''
      formValue = 'NA'
    return (@species?[field] or 'NA') isnt formValue

  doneEdit: (field, $event) ->
    _nextField = (field) =>
      found = false
      for column in @classificationColumns
        if found
          return column.field
        else
          found = true if column.field is field
      return null

    if $event.keyCode is 13
      @editing[field] = false

      nextField = _nextField field
      @editing[nextField] = true if nextField

  checkBWGname: (bwg_name) ->
    if !bwg_name or bwg_name.trim().length is 0
      return @data.bwg_name = error: "required"

    if @edit? and bwg_name is @species.bwg_name
      return @data.bwg_name.error = null

    @SpeciesF.checkBWGname bwg_name
    .then (available) =>
      if available
        @data.bwg_name.error = null
        @data.bwg_name.checked = true
      else
        @data.bwg_name.error = @SpeciesF.BWG_NAME_TAKEN

  loadSpecies: (species_id) ->
    return @SpeciesF.loadSpeciesById species_id

  populateSpecies: (species) ->
    @data = {}
    fields = (c.field for c in @SpeciesF.classificationColumns)

    for k, v of species when k not in ['traits', 'names']
      if k in fields
        @data[k] =
          value: v
          error: null

    @populateNames species.names
    @populateTraits species.traits
    @populateTachet species.tachet

  populateTraits: (traits) ->
    @traits = []
    if traits
      for type, value of traits
        @traits.push type: type, value: value

  populateTachet: (tachet) ->
    @tachet = tachet

  populateNames: (names) ->
    @names = []
    if names
      for name in names
        @names.push text: name

  getTraitWidth: (trait) ->
    unless trait and trait.length > 0
      return width: '60px'
    return width: (trait.length + 1) * 7 + 'px'

  showSuggestor: (bwg_name) ->
    @SpeciesF.speciesSuggestor bwg_name
    .then (suggestion) =>
      @data.bwg_name = value: suggestion

app.controller 'SpeciesEditC', SpeciesEditC
