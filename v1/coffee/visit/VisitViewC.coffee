class VisitViewC
  constructor: (VisitF, visit_id, $uibModalInstance) ->
    @VisitF = VisitF
    @loadVisit(visit_id)
    @dismiss = $uibModalInstance.dismiss

  loadVisit: (visit_id) ->
    @VisitF.getVisitById visit_id
    .then (visit) =>
      @data = visit

app.controller 'VisitViewC', VisitViewC
