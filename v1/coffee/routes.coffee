app.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise("/dashboard")

  $stateProvider
  .state 'dashboard',
    url: '/dashboard',
    templateUrl: 'dashboard.html'
    controller: 'DashboardC'
    controllerAs: 'dashboard'

  .state 'recover',
    url: '/recover/:token'
    templateUrl: 'recover.html'
    controller: 'RecoverC'
    controllerAs: 'recover'
    resolve:
      token: ($stateParams) -> $stateParams.token

  .state 'species',
    url: '/species?dataset_id'
    templateUrl: 'species/index.html'
    controller: 'SpeciesC'
    controllerAs: 'species'

  .state 'species-new',
    url: '/species/new'
    templateUrl: 'species/edit.html'
    controller: 'SpeciesEditC'
    controllerAs: 'species'
    resolve:
      edit: -> null

  .state 'species-edit',
    url: '/species/edit/:id'
    templateUrl: 'species/edit.html'
    controller: 'SpeciesEditC'
    controllerAs: 'species'
    resolve:
      edit: ($stateParams) -> $stateParams.id

  .state 'dataset',
    url: '/dataset'
    templateUrl: 'dataset/index.html'
    controller: 'DatasetC'
    controllerAs: 'dataset'

  .state 'dataset-view',
    url: '/dataset/view/:dataset_id'
    templateUrl: 'dataset/view.html'
    controller: 'DatasetViewC'
    controllerAs: 'dataset'
    resolve:
      editingMatrix: => value: false

  .state 'dataset-view.overview',
    url: '/overview'
    templateUrl: 'dataset/overview.html'
    controller: 'DatasetOverviewC'
    controllerAs: 'dataset'

  .state 'dataset-view.measurements',
    url: '/measurements'
    templateUrl: 'dataset/measurements.html'
    controller: 'DatasetMeasurementsC'
    controllerAs: 'dataset'

  .state 'dataset-view.matrix',
    url: '/matrix'
    templateUrl: 'dataset/matrix.html'
    controller: 'DatasetMatrixC'
    controllerAs: 'dataset'

  .state 'visit',
    url: '/visit?dataset_id'
    templateUrl: 'visit/index.html'
    controller: 'VisitC'
    controllerAs: 'visit'

  .state 'bromeliad',
    url: '/bromeliad?dataset_id&visit_id'
    templateUrl: 'bromeliad/index.html'
    controller: 'BromeliadC'
    controllerAs: 'bromeliad'

  .state 'admin',
    url: '/admin'
    templateUrl: 'admin/index.html'
    controller: 'AdminC'
    controllerAs: 'admin'

  .state 'admin.users',
    url: '/admin/users'
    templateUrl: 'admin/users.html'
    controller: 'AdminUsersC'
    controllerAs: 'admin'

  .state 'admin.tachet',
    url: '/admin/tachet'
    templateUrl: 'admin/tachet.html'
    controller: 'AdminTachetC'
    controllerAs: 'admin'

  .state 'admin.markdowns',
    url: '/admin/markdowns'
    templateUrl: 'admin/markdowns.html'
    controller: 'AdminMarkdownC'
    controllerAs: 'admin'

  .state 'history',
    url: '/history'
    templateUrl: 'history/index.html'
    controller: 'HistoryC'
    controllerAs: 'history'
