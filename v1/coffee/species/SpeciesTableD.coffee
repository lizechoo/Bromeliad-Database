app.directive 'speciesTableD', (SpeciesF) ->
  restrict: 'EAC'
  templateUrl: 'species/table.html'
  scope:
    params: '=params'
    columns: '=columns'
    selected: '=selected'
    count: '=count'
  link: (scope, element, attrs) ->
    scope.viewSpecies = (species_id) ->
      SpeciesF.showSpecies species_id

    scope.countArray = (count) ->
      [0..count-1]

    scope.sort = (column) ->
      return unless column.sortable
      sortOrder =
        if scope.params.isSortBy(column.field, 'asc')
        then 'desc' else 'asc'
      scope.params.sorting(column.field, sortOrder)

    scope.formatNames = (names) ->
      nameStr = ""
      for name in names
        nameStr += name + "<br>"
      return nameStr

    scope.naColor = (value) ->
      return unless value is 'NA'
      'color: #ccc !important'

    scope.select = (species) ->
      return unless species
      if scope.isSelected(species)
        scope.selected =
          scope.selected.filter (e) -> e isnt species.species_id
      else
        scope.selected.push species.species_id

    scope.isSelected = (species) ->
      return unless species
      if species.species_id in scope.selected
        return true
      return false
