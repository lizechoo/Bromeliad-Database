app.factory 'SpeciesF', (ConstantsF, ApiF, $http, $q, $uibModal, ngDialog) ->

  SpeciesF = {}

  SpeciesF.BWG_NAME_TAKEN = "BWG code taken"
  SpeciesF.AUTO_COMPLETE_LIMIT = 15

  SpeciesF.showSpecies = (species_id) ->
    console.log species_id
    $uibModal.open
      templateUrl: 'species/view.html'
      controller: 'SpeciesViewC'
      controllerAs: 'species'
      resolve:
        species_id: -> species_id

  SpeciesF.loadSpecies = (params) ->
    options = {}
    if params
      options.params = params
    return ApiF.get('species', 'list', options)
    .then (results) ->
      return [results.species, results.total, results.traits, results.tachet]

  SpeciesF.getDataset = (species_id) ->
    ApiF.get('species', 'dataset', params: species_ids: species_id)
      .then (results) ->
        if results[species_id]
          return results[species_id]
        else
          return []

  SpeciesF.loadSpeciesById = (species_id) ->
    options =
      params:
        species_id: species_id
        traits: true
        tachet: true
    return ApiF.get('species', 'list', options)
    .then (results) ->
      if results?.species?.length > 0
        return results.species[0]
      else
        throw new Error "Species (species_id: #{species_id}) not found"
        return $q.reject()

  SpeciesF.loadTraitSuggestions = (type) ->
    params = search: type
    return ApiF.get('species', 'traits-list', params: params)
    .then (results) ->
      return results.types

  SpeciesF.loadSpeciesAutoComplete = (search) ->
    params =
      bwg_name: search
      limit: SpeciesF.AUTO_COMPLETE_LIMIT
    return ApiF.get('species', 'auto-complete', params: params)

  SpeciesF.loadTachetTraits = ->
    ApiF.get('tachet', 'list')

  SpeciesF.createTachetTrait = (data) ->
    ApiF.postWithLoading('tachet', 'new', null, traits: data)

  SpeciesF.updateTachetTraits = (data) ->
    ApiF.postWithLoading('tachet', 'edit', null, traits: data)

  SpeciesF.deleteTrait = (trait) ->
    ApiF.postWithLoading('tachet', 'delete', null, traits: [trait])

  # create 1 species in the database
  SpeciesF.createSpecies = (species) ->
    try
      SpeciesF.validateSpecies species
    catch err
      return $q.reject(err)

    species = SpeciesF.omitEmptyFields species

    data =
      species: [species]

    return ApiF.post('species', 'new', null, data)
    .then (results) ->
      return [results.inserted, results.duplicates]

  SpeciesF.createSpeciesBatch = (batch, log_id) ->
    data = species: []
    for species in batch
      data.species.push SpeciesF.omitEmptyFields species

    return ApiF.post('species', 'new', params: log_id: log_id, data)
    .then (results) ->
      return [results.inserted, results.duplicates]

  SpeciesF.editSpecies = (species_id, species) ->
    try
      SpeciesF.validateSpecies species
    catch error
      return $q.reject(err)

    SpeciesF.populateNA species

    data = species: {}
    data.species[species_id] = species
    return ApiF.postWithLoading('species', 'edit', null, data)

  SpeciesF.deleteSpecies = (species) ->
    return ApiF.post('species', 'delete', null, species: species)

  SpeciesF.checkBWGname = (bwg_name) ->
    params = bwg_name: bwg_name
    return ApiF.get('species', 'check-species', params: params)
    .then (results) ->
      return results.available

  SpeciesF.speciesToCSV = (list) ->
    Papa.unparse angular.toJson(list)

  SpeciesF.validateSpecies = (species) ->
    if !species.bwg_name or species.bwg_name.length is 0
      throw new Error 'BWG code is a required field.'

  SpeciesF.validateTraits = (traits) ->
    fields = (c.field for c in SpeciesF.classificationColumns)

    for type, value of traits
      if type in fields
        throw new Error "Trait '#{type}' is a classification field. \
        <br>Please rename the trait."
      if type is 'type'
        throw new Error "Traits cannot have the type 'type'"
      if type is 'value'
        throw new Error "Traits cannot have the type 'value'"

  SpeciesF.omitEmptyFields = (species) ->
    _.omit species, (value) ->
      typeof value is 'string' and value.trim() is ""

  SpeciesF.populateNA = (species) ->
    for k, v of species
      if typeof v is 'string' and v.trim().length is 0
        species[k] = "NA"

  SpeciesF.speciesSuggestor = (prefix) ->
    ngDialog.openConfirm
      templateUrl: 'species/suggestor.html'
      controller: 'SpeciesSuggestorC'
      controllerAs: 'species'
      resolve:
        prefix: -> if prefix and prefix.length > 0 then prefix else null

  SpeciesF.getSuggestedBWGName = (prefix) ->
    ApiF.get('species', 'suggest', params: prefix: prefix)
    .then (results) ->
      results.suggestion

  SpeciesF.classificationColumns = [
    { label: "BWG code", field: "bwg_name", alias: ['bwg_code'] }
    { label: "Domain", field: "domain" }
    { label: "Kingdom", field: "kingdom" }
    { label: "Phylum", field: "phylum" }
    { label: "Sub Phylum", field: "subphylum" }
    { label: "Class", field: "class"}
    { label: "Sub Class", field: "subclass"}
    { label: "Order", field: "ord", alias: ['order']}
    { label: "Sub Order", field: "subord", alias: ['suborder']}
    { label: "Family", field: "family"}
    { label: "Sub Family", field: "subfamily"}
    { label: "Tribe", field: "tribe"}
    { label: "Genus", field: "genus"}
    { label: "Species", field: "species"}
    { label: "Sub Species", field: "subspecies"}
    { label: "Functional Group", field: "functional_group", options: ["NA", "gatherer", "scraper", "shredder", "filter.feeder", "piercer", "engulfer"]}
    { label: "Realm", field: "realm", options: ["NA", "aquatic", "terrestrial"]}
    { label: "Micro/Macro", field: "micro_macro", options: ["NA", "micro", "macro"]}
    { label: "Predation", field:"predation", options: ["NA", "predator", "prey"]}
  ]

  return SpeciesF
