app.directive 'timelineD', (HistoryF, SpeciesF, VisitF, BromeliadF, AvatarF) ->
  restrict: 'EAC'
  templateUrl: 'history/timeline.html'
  scope:
    history: '=history'
    comments: '=comments'
    submitComment: '=onSubmitComment'
  link: (scope, element, attrs) ->
    scope.parseAction = HistoryF.parseAction

    scope.parseTime = HistoryF.parseTime

    scope.getDatasetInfo = HistoryF.getDatasetInfo

    scope.logGlyphClass = (log) ->
      return unless log.type
      switch log.type
        when "species" then return {"fa-bug": 1, "bg-green": 1}
        when "datasets" then return {"fa-list-alt": 1, "bg-blue": 1}
        when "visits" then return {"fa-map-marker": 1, "bg-yellow": 1}
        when "bromeliads" then return {"fa-tree": 1, "bg-purple": 1}
        when "measurements" then return {"fa-arrows-h": 1, "bg-teal": 1}
        when "matrix" then return {"fa-cubes": 1, "bg-fuchsia": 1}

    scope.viewSpecies = (species_id) ->
      SpeciesF.showSpecies species_id

    scope.viewVisit = (visit_id) ->
      VisitF.showVisit visit_id

    scope.viewBromeliad = (bromeliad_id) ->
      BromeliadF.showBromeliad bromeliad_id

    scope.getAvatarSrc = AvatarF.getSrcPath
