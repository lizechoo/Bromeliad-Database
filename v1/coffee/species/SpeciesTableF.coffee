app.factory 'SpeciesTableF', (SpeciesF, ngTableParams, $q) ->
  SpeciesTableF = {}

  SpeciesTableF.classificationColumns = [
    { field: 'species_id', visible: false, sortable: true, title: 'ID' }
    { field: 'bwg_name', visible: true, primary: true, sortable: true, title: 'BWG code' }
    { field: 'domain', visible: true, sortable: true, title: 'Domain' }
    { field: 'kingdom', visible: true, sortable: true, title: 'Kingdom' }
    { field: 'phylum', visible: true, sortable: true, title: 'Phylum' }
    { field: 'subphylum', visible: true, sortable: true, title: 'Sub Phylum' }
    { field: 'class', visible: true, sortable: true, title: 'Class' }
    { field: 'subclass', visible: true, sortable: true, title: 'Sub Class' }
    { field: 'ord', visible: true, sortable: true, title: 'Order' }
    { field: 'subord', visible: true, sortable: true, title: 'SubOrder' }
    { field: 'family', visible: true, sortable: true, title: 'Family' }
    { field: 'subfamily', visible: true, sortable: true, title: 'SubFamily' }
    { field: 'tribe', visible: true, sortable: true, title: 'Tribe' }
    { field: 'genus', visible: true, sortable: true, title: 'Genus' }
    { field: 'species', visible: true, sortable: true, title: 'Species' }
    { field: 'subspecies', visible: true, sortable: true, title: 'SubSpecies' }
    { field: 'functional_group', visible: true, sortable: true, title: 'Func. Group' }
    { field: 'realm', visible: true, sortable: true, title: 'Realm' }
    { field: 'predation', visible: true, sortable: true, title: 'Predation' }
    { field: 'micro_macro', visible: true, sortable: true, title: 'Micro/Macro' }
    { field: 'names', visible: true, sortable: false, title: 'Other names' }
    { field: 'barcode', visible: true, sortable: true, title: 'Barcode' }
  ]

  SpeciesTableF.traitsColumns = []

  SpeciesTableF.tachetColumns = []

  SpeciesTableF.setTraits = (traits) ->
    return if SpeciesTableF._columnsMatch(SpeciesTableF.traitsColumns, traits)
    SpeciesTableF.traitsColumns = [
      field: 'bwg_name'
      visible: true
      primary: true
      sortable: true
      title: 'BWG code'
    ]
    for trait in traits
      SpeciesTableF.traitsColumns.push
        field: trait
        visible: true
        sortable: false
        title: trait
        trait: true

  SpeciesTableF.setTachet = (tachets) ->
    SpeciesTableF.tachetColumns = [
      field: 'bwg_name'
      visible: true
      primary: true
      sortable: true
      title: 'BWG code'
    ]
    for tachet in tachets
      SpeciesTableF.tachetColumns.push
        field: tachet.trait
        visible: true
        sortable: false
        title: tachet.trait
        trait: true
        tachet: true
        description: tachet.description

  SpeciesTableF._columnsMatch = (columns, traits) ->
      return false unless (columns.length - 1) is traits.length
      return false if columns.length is 0
      for column in columns when column.field isnt 'bwg_name'
        if column.field not in traits
          return false
      return true

  SpeciesTableF.tableParams = (scope) ->
    return new ngTableParams {
      page: scope.tableInfo?.page || 1
      count: scope.tableInfo?.count || 20
      sorting:
        species_id: 'asc'
      counts: [10, 30, 50, 100, 100000]
    },
    { getData: ($defer, params) ->
        scope.loading = true
        orderBy = params.orderBy()[0]?.substring(1)
        asc = if params.orderBy()[0]?.substring(0, 1) == '+' then 'true' else 'false'
        options =
          page: params.page()
          limit: params.count()
          orderBy: orderBy
          asc: asc
        options.search = scope.search if scope.search

        options.traits = (scope.view is 'traits')
        options.tachet = (scope.view is 'tachet')

        options.dataset_id = scope.dataset_id if scope.dataset_id

        promise = SpeciesF.loadSpecies(options)
        .then ([species, total, traits, tachet]) ->
          if options.traits
            SpeciesTableF.setTraits(traits)
          else if options.tachet
            SpeciesTableF.setTachet(tachet)
          scope.loading = false
          scope.species = species
          scope.tableInfo =
            total: total
            page: params.page()
            count: params.count()
          params.total total
          $defer.resolve species
      counts: [10, 30, 50, 100, 100000]
      $loading: false
    }

  return SpeciesTableF
