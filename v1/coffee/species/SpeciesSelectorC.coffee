class SpeciesSelectorC
  SPECIES_PER_PAGE: 10
  selected: null

  constructor: (SpeciesF, $uibModalInstance) ->
    @SpeciesF = SpeciesF
    @showSpecies = SpeciesF.showSpecies
    @$uibModalInstance = $uibModalInstance
    @classificationColumns = @SpeciesF.classificationColumns
    @page = 1
    @loadSpecies(null, @page)

  loadSpecies: (search, page) ->
    params = page: page, limit: @SPECIES_PER_PAGE
    params.search = search if search and search.length > 0
    @SpeciesF.loadSpecies(params)
    .then ([species, total]) =>
      @data = species
      @total = total
      @page = page

  doSearch: (search) ->
    @search = search
    @loadSpecies search, 1

  isSelected: (species) ->
    return false unless @selected
    species.species_id is @selected.species_id

  setSelected: (species) ->
    if @selected?.species_id is species.species_id
      @selected = null
    else
      @selected = species

  setPage: ->
    return if @page is '...'
    @loadSpecies(@search, @page)

  submit: ->
    unless @selected?
      throw new Error "No species selected"
    @$uibModalInstance.close @selected

  getShowing: ->
    total = @total
    page = @page
    count = 10
    beginning = if (page-1)*count+1 > 0 then (page-1)*count+1 else 0
    end = if page*count > total then total else page*count
    beginning = 0 if end is 0
    "Showing #{beginning} - #{end} of #{total}"

app.controller 'SpeciesSelectorC', SpeciesSelectorC
