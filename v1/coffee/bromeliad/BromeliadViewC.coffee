class BromeliadViewC
  constructor: (bromeliad_id, BromeliadF, $uibModalInstance) ->
    @BromeliadF = BromeliadF
    @$uibModalInstance = $uibModalInstance
    @loadBromeliad(bromeliad_id)

  loadBromeliad: (bromeliad_id) ->
    @BromeliadF.getBromeliadById bromeliad_id
    .then (bromeliad) =>
      @data = bromeliad

  dismiss: ->
    @$uibModalInstance.dismiss()

app.controller 'BromeliadViewC', BromeliadViewC
