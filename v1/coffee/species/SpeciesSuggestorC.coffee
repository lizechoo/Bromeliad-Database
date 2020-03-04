class SpeciesSuggestorC
  constructor: (SpeciesF, prefix) ->
    @SpeciesF = SpeciesF
    @prefix = prefix

  getSuggestion: (prefix) ->
    if not prefix or prefix.length is 0
      throw new Error "Enter a prefix to get suggested BWG code"

    if not isNaN(parseInt(prefix.slice(-1)))
      throw new Error "Prefix must not already end with a number"

    dotPos = prefix.indexOf(".")
    if dotPos != -1 and dotPos != prefix.length - 1
      throw new Error "The dot \".\" must be at the end of the prefix"

    @generating = true
    @SpeciesF.getSuggestedBWGName prefix
    .then (suggestion) =>
      @suggestion = angular.copy(prefix) + suggestion
      @generating = false

app.controller 'SpeciesSuggestorC', SpeciesSuggestorC
