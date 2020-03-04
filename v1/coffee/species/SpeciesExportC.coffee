class SpeciesExportC
  FILE_MAP:
    csv: "CSV"
    tsv: "TSV"
    json: "JSON"

  CONTENT_MAP:
    all: "Entire Database"
    display: "Currently Displayed"
    selections: "Selections"

  constructor: (SpeciesExportF, species, selected, $scope) ->
    @SpeciesExportF = SpeciesExportF
    @species = species
    @selected = selected
    @$scope = $scope

    @setFileType 'csv'
    @exportContent = if @selected.length > 0 then 'selections' else 'display'

  setFileType: (type) ->
    @stage = 0
    @fileType = type

  setContent: (content) ->
    @stage = 0
    @exportContent = content

  export: ->
    @stage = 1

    if @exportContent is 'selections'
      data = (s for s in @species when s.species_id in @selected)
    else if @exportContent is 'display'
      data = @species
    else # all

    if data.length is 0
      @stage = 0
      throw new Error "No species to export"
      return

    text = @SpeciesExportF.unparseSpecies data, @fileType
    component = encodeURIComponent(text)

    if @fileType is 'csv'
      @fileName = 'species-export.csv'
      @link = 'data:text/csv;charset=utf-8,' + component
    else if @fileType is 'tsv'
      @fileName = 'species-export.txt'
      @link = 'data:text/tab-separated-values;charset=utf-8,' + component
    else
      @fileName = 'species-export.json'
      @link = 'data:application/json;charset=utf-8,' + component

    setTimeout =>
      @stage = 2
      @$scope.$apply =>
        @stage = 2
    , 1000
    return

app.controller 'SpeciesExportC', SpeciesExportC
