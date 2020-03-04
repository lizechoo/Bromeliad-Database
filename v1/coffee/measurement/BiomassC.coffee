class BiomassC
  constructor: ($scope, tag, ValidatorF) ->
    $scope.biomass = tag.biomass or ""
    $scope.tag = tag
    $scope.submit = (biomass) ->
      ValidatorF.validateNumber 'Biomass', biomass
      $scope.confirm biomass

app.controller 'BiomassC', BiomassC
