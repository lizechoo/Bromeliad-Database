var app, dependencies;

dependencies = ['ui.router', 'ngTable', 'ngTableExport', 'ui.bootstrap', 'ngTagsInput', 'LocalStorageModule', 'templates', 'ngDialog', 'capitalFilter', 'ngSanitize', 'truncate', 'hc.marked', 'angular-loading-bar'];

app = angular.module('app', dependencies);

app.config([
  'markedProvider', function(markedProvider) {
    return markedProvider.setOptions({
      gfm: true
    });
  }
]);

angular.module('capitalFilter', []).filter('capital', function() {
  return function(input) {
    if (!input) {
      return;
    }
    return input[0].toUpperCase() + input.substr(1);
  };
});

var MainC;

MainC = (function() {
  function MainC(UserF, HelpMessageF, ngDialog, AvatarF, $window) {
    this.UserF = UserF;
    this.AvatarF = AvatarF;
    this.$window = $window;
    this.loadUser = function() {
      return UserF.getUser().then((function(_this) {
        return function(user) {
          return _this.user = user;
        };
      })(this));
    };
    this.logout = function() {
      return UserF.logout();
    };
    this.setPassword = function() {
      return ngDialog.openConfirm({
        template: 'users/set-password.html',
        controller: 'UserPasswordC',
        controllerAs: 'user',
        resolve: {
          onPasswordSet: function() {
            return null;
          }
        }
      });
    };
    HelpMessageF.fetchHelp().then((function(_this) {
      return function() {
        return _this.loadUser();
      };
    })(this)).then((function(_this) {
      return function(user) {
        if (user != null ? user.avatar : void 0) {
          return _this.loadUserImage(user.avatar);
        }
      };
    })(this));
  }

  MainC.prototype.setAvatar = function() {
    return this.UserF.setAvatar().then((function(_this) {
      return function() {
        return _this.$window.location.reload();
      };
    })(this));
  };

  MainC.prototype.loadUserImage = function(file_id) {
    return this.AvatarF.getImageSrc(file_id).then((function(_this) {
      return function(path) {
        return _this.userImage = path;
      };
    })(this));
  };

  return MainC;

})();

angular.module('app').controller('MainC', MainC);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/dashboard");
  return $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'dashboard.html',
    controller: 'DashboardC',
    controllerAs: 'dashboard'
  }).state('recover', {
    url: '/recover/:token',
    templateUrl: 'recover.html',
    controller: 'RecoverC',
    controllerAs: 'recover',
    resolve: {
      token: function($stateParams) {
        return $stateParams.token;
      }
    }
  }).state('species', {
    url: '/species?dataset_id',
    templateUrl: 'species/index.html',
    controller: 'SpeciesC',
    controllerAs: 'species'
  }).state('species-new', {
    url: '/species/new',
    templateUrl: 'species/edit.html',
    controller: 'SpeciesEditC',
    controllerAs: 'species',
    resolve: {
      edit: function() {
        return null;
      }
    }
  }).state('species-edit', {
    url: '/species/edit/:id',
    templateUrl: 'species/edit.html',
    controller: 'SpeciesEditC',
    controllerAs: 'species',
    resolve: {
      edit: function($stateParams) {
        return $stateParams.id;
      }
    }
  }).state('dataset', {
    url: '/dataset',
    templateUrl: 'dataset/index.html',
    controller: 'DatasetC',
    controllerAs: 'dataset'
  }).state('dataset-view', {
    url: '/dataset/view/:dataset_id',
    templateUrl: 'dataset/view.html',
    controller: 'DatasetViewC',
    controllerAs: 'dataset',
    resolve: {
      editingMatrix: (function(_this) {
        return function() {
          return {
            value: false
          };
        };
      })(this)
    }
  }).state('dataset-view.overview', {
    url: '/overview',
    templateUrl: 'dataset/overview.html',
    controller: 'DatasetOverviewC',
    controllerAs: 'dataset'
  }).state('dataset-view.measurements', {
    url: '/measurements',
    templateUrl: 'dataset/measurements.html',
    controller: 'DatasetMeasurementsC',
    controllerAs: 'dataset'
  }).state('dataset-view.matrix', {
    url: '/matrix',
    templateUrl: 'dataset/matrix.html',
    controller: 'DatasetMatrixC',
    controllerAs: 'dataset'
  }).state('visit', {
    url: '/visit?dataset_id',
    templateUrl: 'visit/index.html',
    controller: 'VisitC',
    controllerAs: 'visit'
  }).state('bromeliad', {
    url: '/bromeliad?dataset_id&visit_id',
    templateUrl: 'bromeliad/index.html',
    controller: 'BromeliadC',
    controllerAs: 'bromeliad'
  }).state('admin', {
    url: '/admin',
    templateUrl: 'admin/index.html',
    controller: 'AdminC',
    controllerAs: 'admin'
  }).state('admin.users', {
    url: '/admin/users',
    templateUrl: 'admin/users.html',
    controller: 'AdminUsersC',
    controllerAs: 'admin'
  }).state('admin.tachet', {
    url: '/admin/tachet',
    templateUrl: 'admin/tachet.html',
    controller: 'AdminTachetC',
    controllerAs: 'admin'
  }).state('admin.markdowns', {
    url: '/admin/markdowns',
    templateUrl: 'admin/markdowns.html',
    controller: 'AdminMarkdownC',
    controllerAs: 'admin'
  }).state('history', {
    url: '/history',
    templateUrl: 'history/index.html',
    controller: 'HistoryC',
    controllerAs: 'history'
  });
});

var AdminC;

AdminC = (function() {
  function AdminC(AdminF, $state) {
    this.AdminF = AdminF;
    this.$state = $state;
  }

  AdminC.prototype.newUser = function() {
    return this.AdminF.newUser();
  };

  return AdminC;

})();

app.controller('AdminC', AdminC);

app.factory('AdminF', function(ApiF, ngDialog, UserF, AvatarF, $q) {
  var AdminF;
  AdminF = {};
  AdminF.usersList = [];
  AdminF.loadUsersList = function() {
    return ApiF.get('users', 'all', null).then(function(results) {
      var j, len, promise, promises, ref, user;
      AdminF.usersList = results.users;
      promises = [];
      ref = AdminF.usersList;
      for (j = 0, len = ref.length; j < len; j++) {
        user = ref[j];
        promise = AvatarF.getImageSrc(user.avatar);
        promises.push(promise);
      }
      return $q.all(promises);
    }).then(function(results) {
      var i, j, len, link, results1;
      results1 = [];
      for (i = j = 0, len = results.length; j < len; i = ++j) {
        link = results[i];
        results1.push(AdminF.usersList[i].avatar_link = link);
      }
      return results1;
    });
  };
  AdminF.newUser = function() {
    return ngDialog.openConfirm({
      template: 'users/edit.html',
      controller: 'UserEditC',
      controllerAs: 'user',
      resolve: {
        edit: function() {
          return null;
        }
      }
    });
  };
  AdminF.editUser = function(user) {
    return ngDialog.openConfirm({
      template: 'users/edit.html',
      controller: 'UserEditC',
      controllerAs: 'user',
      resolve: {
        edit: function() {
          return angular.copy(user);
        }
      }
    });
  };
  AdminF.createUser = function(user) {
    return ApiF.post('users', 'create', null, user).then(function() {
      return AdminF.loadUsersList();
    });
  };
  AdminF.updateUser = function(user) {
    return ApiF.post('users', 'edit', null, user).then(function() {
      return AdminF.loadUsersList();
    });
  };
  AdminF.deleteUser = function(username) {
    return ApiF.post('users', 'delete', null, {
      username: username
    }).then(function(res) {
      return AdminF.loadUsersList();
    });
  };
  AdminF.updatePassword = function(password) {
    var data, username;
    username = UserF.user.username;
    data = {
      username: username,
      password: password
    };
    return ApiF.post('users', 'edit', null, data);
  };
  return AdminF;
});

var AdminMarkdownC;

AdminMarkdownC = (function() {
  function AdminMarkdownC(MarkdownF, DialogF) {
    this.MarkdownF = MarkdownF;
    this.markdowns = MarkdownF.markdowns;
    this.DialogF = DialogF;
    this.uneditedMarkdown = null;
    this.article = null;
    this.view = 'write';
  }

  AdminMarkdownC.prototype.showMarkdown = function(type) {
    if ((this.article != null) && this.uneditedMarkdown !== this.markdown) {
      return this.DialogF.confirmDialog("There are unsaved changes in the editing article. Proceed?").then((function(_this) {
        return function() {
          return _this.getMarkdown(type);
        };
      })(this));
    } else {
      return this.getMarkdown(type);
    }
  };

  AdminMarkdownC.prototype.getMarkdown = function(type) {
    return this.MarkdownF.getMarkdown(type).then((function(_this) {
      return function(markdown) {
        _this.article = type;
        _this.view = 'write';
        _this.uneditedMarkdown = angular.copy(markdown);
        return _this.markdown = markdown;
      };
    })(this));
  };

  AdminMarkdownC.prototype.appendImage = function(unique_name) {
    this.markdown += "\n\n";
    return this.markdown += "![Uploaded Image](" + APP_CONST_PATH + "files/" + unique_name + ")\n\n";
  };

  AdminMarkdownC.prototype.uploadImage = function() {
    return this.MarkdownF.uploadDialog().then((function(_this) {
      return function(unique_name) {
        return _this.appendImage(unique_name);
      };
    })(this));
  };

  AdminMarkdownC.prototype.save = function() {
    return this.MarkdownF.updateMarkdown(this.article, this.markdown).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Article successfully saved");
      };
    })(this));
  };

  return AdminMarkdownC;

})();

app.controller('AdminMarkdownC', AdminMarkdownC);

var AdminMarkdownUploadC;

AdminMarkdownUploadC = (function() {
  function AdminMarkdownUploadC(MarkdownF, $scope) {
    this.MarkdownF = MarkdownF;
    this.$scope = $scope;
  }

  AdminMarkdownUploadC.prototype.onUpload = function(file) {
    if (!file) {
      return;
    }
    this.MarkdownF.validateType(file.type);
    this.MarkdownF.validateSize(file.size);
    return this.MarkdownF.uploadFile(file).then((function(_this) {
      return function(unique_name) {
        return _this.$scope.confirm(unique_name);
      };
    })(this));
  };

  return AdminMarkdownUploadC;

})();

app.controller('AdminMarkdownUploadC', AdminMarkdownUploadC);

var AdminTachetC;

AdminTachetC = (function() {
  function AdminTachetC(SpeciesF, DialogF, ngDialog) {
    this.SpeciesF = SpeciesF;
    this.DialogF = DialogF;
    this.ngDialog = ngDialog;
    this.loadTachetTraits();
  }

  AdminTachetC.prototype.loadTachetTraits = function() {
    return this.SpeciesF.loadTachetTraits().then((function(_this) {
      return function(data) {
        return _this.traits = data.traits;
      };
    })(this));
  };

  AdminTachetC.prototype.deleteTrait = function(trait) {
    return this.DialogF.confirmDialog("Trait <b>" + trait + "</b> will be removed. Proceed?").then((function(_this) {
      return function() {
        return _this.SpeciesF.deleteTrait(trait);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadTachetTraits();
      };
    })(this));
  };

  AdminTachetC.prototype.newTrait = function() {
    return this.ngDialog.openConfirm({
      template: 'admin/newTachet.html',
      controller: 'NewTachetC',
      controllerAs: 'admin',
      resolve: {
        traits: (function(_this) {
          return function() {
            return _this.traits;
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Trait added successfully");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadTachetTraits();
      };
    })(this));
  };

  AdminTachetC.prototype.updateDescriptions = function() {
    return this.DialogF.confirmDialog("Trait descriptions will be updated. Proceed?").then((function(_this) {
      return function() {
        var data;
        data = _this.descriptionData();
        return _this.SpeciesF.updateTachetTraits(data);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Descriptions updated successfully");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadTachetTraits();
      };
    })(this));
  };

  AdminTachetC.prototype.moveTrait = function(trait) {
    return this.ngDialog.openConfirm({
      template: 'admin/moveTrait.html',
      controller: 'MoveTraitC',
      controllerAs: 'admin',
      resolve: {
        trait: (function(_this) {
          return function() {
            return trait;
          };
        })(this),
        traits: (function(_this) {
          return function() {
            return _this.traits;
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Trait moved successfully");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadTachetTraits();
      };
    })(this));
  };

  AdminTachetC.prototype.descriptionData = function() {
    var i, len, ref, results, trait;
    results = {};
    ref = this.traits;
    for (i = 0, len = ref.length; i < len; i++) {
      trait = ref[i];
      results[trait.trait] = {
        description: trait.description
      };
    }
    return results;
  };

  AdminTachetC.prototype.hasTraits = function() {
    if (!this.traits) {
      return false;
    }
    return Object.keys(this.traits).length > 0;
  };

  return AdminTachetC;

})();

app.controller('AdminTachetC', AdminTachetC);

var AdminUsersC;

AdminUsersC = (function() {
  function AdminUsersC(AdminF, DialogF) {
    this.AdminF = AdminF;
    this.DialogF = DialogF;
    this.loadUsers();
  }

  AdminUsersC.prototype.loadUsers = function() {
    return this.AdminF.loadUsersList();
  };

  AdminUsersC.prototype.getInitials = function(name) {
    var i, initial, len, part, parts;
    parts = name.split(" ");
    initial = "";
    for (i = 0, len = parts.length; i < len; i++) {
      part = parts[i];
      initial += part[0];
    }
    return initial.toUpperCase();
  };

  AdminUsersC.prototype["delete"] = function(username) {
    return this.DialogF.confirmDialog("User <b>" + username + "</b> will be deleted. Proceed?").then((function(_this) {
      return function() {
        return _this.AdminF.deleteUser(username);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("User successfully deleted");
      };
    })(this));
  };

  AdminUsersC.prototype.editUser = function(user) {
    return this.AdminF.editUser(user);
  };

  AdminUsersC.prototype.getAvatar = function(user) {
    if (!user.avatar_link) {
      return null;
    }
    return user.avatar_link;
  };

  return AdminUsersC;

})();

app.controller('AdminUsersC', AdminUsersC);

var MoveTraitC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

MoveTraitC = (function() {
  function MoveTraitC(SpeciesF, $scope, trait, traits) {
    var row;
    this.SpeciesF = SpeciesF;
    this.$scope = $scope;
    this.trait = trait;
    this.traits = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = traits.length; i < len; i++) {
        row = traits[i];
        if (row.trait !== trait) {
          results.push(row.trait);
        }
      }
      return results;
    })();
  }

  MoveTraitC.prototype.submit = function() {
    var ref, request;
    request = {};
    request[this.trait] = {};
    if (this.order === 'front') {
      request[this.trait].after = 'species_id';
    } else if (this.order === 'all') {
      request[this.trait].after = this.traits[this.traits.length - 1];
    } else if (this.order === 'select') {
      if (ref = this.after, indexOf.call(this.traits, ref) < 0) {
        throw new Error("Select an existing trait to put new trait after");
      }
      request[this.trait].after = this.after;
    }
    return this.SpeciesF.updateTachetTraits(request).then((function(_this) {
      return function() {
        return _this.$scope.confirm();
      };
    })(this));
  };

  return MoveTraitC;

})();

app.controller('MoveTraitC', MoveTraitC);

var NewTachetC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

NewTachetC = (function() {
  function NewTachetC(SpeciesF, DialogF, traits, $scope) {
    this.SpeciesF = SpeciesF;
    this.DialogF = DialogF;
    this.traits = traits;
    this.$scope = $scope;
  }

  NewTachetC.prototype.submit = function() {
    var k, ref, request, trait;
    request = {};
    if ((!this.data) || (!this.data.trait) || this.data.trait.trim().length === 0) {
      throw new Error("Trait field is required");
    }
    trait = this.data.trait;
    request[trait] = {};
    if (this.data.description && this.data.description.trim().length !== 0) {
      request[trait].description = this.data.description;
    }
    if (this.order === 'front') {
      request[trait].after = 'species_id';
    } else if (this.order === 'select') {
      if (ref = this.after, indexOf.call((function() {
        var i, len, ref1, results;
        ref1 = this.traits;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          k = ref1[i];
          results.push(k.trait);
        }
        return results;
      }).call(this), ref) < 0) {
        throw new Error("Select an existing trait to put new trait after");
      }
      request[trait].after = this.after;
    }
    return this.SpeciesF.createTachetTrait(request).then((function(_this) {
      return function() {
        return _this.$scope.confirm();
      };
    })(this));
  };

  return NewTachetC;

})();

app.controller('NewTachetC', NewTachetC);

var BromeliadC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BromeliadC = (function() {
  var _getAttributes;

  BromeliadC.prototype.sorting = {
    field: null,
    desc: null,
    is: function(field, desc) {
      return (field === this.field) && (desc === this.desc);
    },
    sort: function(field) {
      if (this.field === field) {
        return this.desc = this.desc ? false : true;
      } else {
        this.field = field;
        return this.desc = false;
      }
    }
  };

  function BromeliadC(BromeliadF, DatasetF, VisitF, $window, $stateParams, $uibModal, DialogF, ngDialog, BromeliadUploadF, BromeliadHelp) {
    this.BromeliadF = BromeliadF;
    this.BromeliadUploadF = BromeliadUploadF;
    this.showBromeliad = BromeliadF.showBromeliad;
    this.fields = BromeliadF.fields;
    this.DatasetF = DatasetF;
    this.VisitF = VisitF;
    this.$window = $window;
    this.data = [];
    this.$uibModal = $uibModal;
    this.DialogF = DialogF;
    this.ngDialog = ngDialog;
    this.BromeliadHelp = BromeliadHelp;
    if ($stateParams.dataset_id != null) {
      this.dataset_id = $stateParams.dataset_id;
    } else if ($stateParams.visit_id != null) {
      this.visit_id = $stateParams.visit_id;
    }
    this.selected = [];
    this.loadDatasets().then((function(_this) {
      return function() {
        return _this.loadBromeliads();
      };
    })(this));
  }

  BromeliadC.prototype.upload = function() {
    return this.BromeliadUploadF.uploadDialog(this.visit_id).then((function(_this) {
      return function() {
        return _this.loadBromeliads();
      };
    })(this));
  };

  BromeliadC.prototype["new"] = function() {
    var modal;
    modal = this.$uibModal.open({
      templateUrl: 'bromeliad/edit.html',
      controller: 'BromeliadEditC',
      controllerAs: 'bromeliad',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        dataset_id: (function(_this) {
          return function() {
            return _this.dataset_id;
          };
        })(this),
        visit_id: (function(_this) {
          return function() {
            return _this.visit_id;
          };
        })(this),
        edit: function() {
          return null;
        }
      }
    });
    return modal.result.then((function(_this) {
      return function(success) {
        return _this.DialogF.successDialog("Bromeliad successfully created");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadBromeliads();
      };
    })(this));
  };

  BromeliadC.prototype.edit = function() {
    var b, bromeliad, i, len, modal, ref;
    if (this.selected.length > 1) {
      throw new Error("Select only one bromeliad to edit");
    }
    ref = this.data;
    for (i = 0, len = ref.length; i < len; i++) {
      b = ref[i];
      if (b.bromeliad_id === this.selected[0]) {
        bromeliad = b;
      }
    }
    modal = this.$uibModal.open({
      templateUrl: 'bromeliad/edit.html',
      controller: 'BromeliadEditC',
      controllerAs: 'bromeliad',
      keyboard: false,
      backdrop: 'static',
      resolve: {
        dataset_id: null,
        visit_id: null,
        edit: _.omit(bromeliad, ['dataset_id', 'dataset_name', 'visit_habitat'])
      }
    });
    return modal.result.then((function(_this) {
      return function(success) {
        return _this.DialogF.successDialog("Bromeliads successfully edited");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadBromeliads();
      };
    })(this));
  };

  BromeliadC.prototype.back = function() {
    return this.$window.history.back();
  };

  BromeliadC.prototype["delete"] = function() {
    if (this.selected.length === 0) {
      throw new Error("Select at least 1 bromeliad to delete");
    }
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: (function(_this) {
          return function() {
            return _this.selected.length + " bromeliads will be delete. Proceed?";
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.BromeliadF.deleteBromeliads(_this.selected);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.ngDialog.openConfirm({
          template: 'successDialog.html',
          controller: 'ConfirmC',
          resolve: {
            doubleConfirm: function() {
              return null;
            },
            message: function() {
              return "Bromeliads successfully deleted";
            }
          }
        });
      };
    })(this)).then((function(_this) {
      return function() {
        _this.selected = [];
        return _this.loadBromeliads();
      };
    })(this));
  };

  BromeliadC.prototype.loadDatasets = function() {
    return this.DatasetF.getDatasets().then((function(_this) {
      return function(datasets) {
        var d, i, len, ref;
        _this.datasets = datasets;
        ref = _this.datasets;
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          if (d.dataset_id === _this.dataset_id) {
            _this.dataset = d;
          }
        }
        return _this.loadVisits();
      };
    })(this));
  };

  BromeliadC.prototype.loadVisits = function() {
    return this.VisitF.getVisits().then((function(_this) {
      return function(visits) {
        var d, i, j, len, len1, ref, results, v;
        if (_this.visit_id) {
          for (i = 0, len = visits.length; i < len; i++) {
            v = visits[i];
            if (v.visit_id === _this.visit_id) {
              _this.visit = v;
            }
          }
          _this.visits = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = visits.length; j < len1; j++) {
              v = visits[j];
              if (v.dataset_id === this.visit.dataset_id) {
                results.push(v);
              }
            }
            return results;
          }).call(_this);
          ref = _this.datasets;
          results = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            d = ref[j];
            if (d.dataset_id === _this.visit.dataset_id) {
              results.push(_this.dataset = d);
            }
          }
          return results;
        } else if (_this.dataset_id) {
          return _this.visits = (function() {
            var l, len2, results1;
            results1 = [];
            for (l = 0, len2 = visits.length; l < len2; l++) {
              v = visits[l];
              if (v.dataset_id === this.dataset_id) {
                results1.push(v);
              }
            }
            return results1;
          }).call(_this);
        } else {
          return _this.visits = visits;
        }
      };
    })(this));
  };

  BromeliadC.prototype.populateVisitHabitat = function() {
    var bromeliad, i, len, ref, results, visit;
    ref = this.data;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      bromeliad = ref[i];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.visits;
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          visit = ref1[j];
          if (visit.visit_id === bromeliad.visit_id) {
            results1.push(bromeliad.visit_habitat = visit.habitat);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  BromeliadC.prototype.populateDataset = function() {
    var bromeliad, dataset, i, len, ref, results, visit;
    ref = this.data;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      bromeliad = ref[i];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.visits;
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          visit = ref1[j];
          if (!(visit.visit_id === bromeliad.visit_id)) {
            continue;
          }
          bromeliad.dataset_id = visit.dataset_id;
          results1.push((function() {
            var l, len2, ref2, results2;
            ref2 = this.datasets;
            results2 = [];
            for (l = 0, len2 = ref2.length; l < len2; l++) {
              dataset = ref2[l];
              if (dataset.dataset_id === visit.dataset_id) {
                results2.push(bromeliad.dataset_name = dataset.name);
              }
            }
            return results2;
          }).call(this));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  BromeliadC.prototype.updateBromeliads = function(bromeliads) {
    this.data = bromeliads;
    return this.attributes = _getAttributes(bromeliads);
  };

  BromeliadC.prototype.loadBromeliads = function() {
    var params;
    if (this.dataset_id != null) {
      params = {
        dataset_id: this.dataset_id
      };
    } else if (this.visit_id != null) {
      params = {
        visit_id: this.visit_id
      };
    }
    return this.BromeliadF.getBromeliads(params).then((function(_this) {
      return function(bromeliads) {
        return _this.updateBromeliads(bromeliads);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.populateVisitHabitat();
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.populateDataset();
      };
    })(this));
  };

  BromeliadC.prototype.clearSelected = function() {
    return this.selected = [];
  };

  BromeliadC.prototype.toggleSelect = function(bromeliad) {
    var ref;
    if (ref = bromeliad.bromeliad_id, indexOf.call(this.selected, ref) >= 0) {
      return this.selected = this.selected.filter(function(e) {
        return e !== bromeliad.bromeliad_id;
      });
    } else {
      return this.selected.push(bromeliad.bromeliad_id);
    }
  };

  BromeliadC.prototype.isSelected = function(bromeliad) {
    var ref;
    return ref = bromeliad.bromeliad_id, indexOf.call(this.selected, ref) >= 0;
  };

  BromeliadC.prototype.hasSelected = function() {
    return this.selected.length > 0;
  };

  BromeliadC.prototype.help = function(section) {
    return this.BromeliadHelp[section];
  };

  _getAttributes = function(bromeliads) {
    var attributes, bromeliad, i, k, len, ref, v;
    attributes = {};
    for (i = 0, len = bromeliads.length; i < len; i++) {
      bromeliad = bromeliads[i];
      if (bromeliad.attributes) {
        ref = bromeliad.attributes;
        for (k in ref) {
          v = ref[k];
          attributes[k] = true;
        }
      }
    }
    return (function() {
      var results;
      results = [];
      for (k in attributes) {
        v = attributes[k];
        results.push(k);
      }
      return results;
    })();
  };

  return BromeliadC;

})();

app.controller('BromeliadC', BromeliadC);

var BromeliadDetritusEditC,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BromeliadDetritusEditC = (function() {
  function BromeliadDetritusEditC(detritus, $scope, BromeliadHelp) {
    this.help = bind(this.help, this);
    this.BromeliadHelp = BromeliadHelp;
    this.$scope = $scope;
    if (!detritus || detritus.length === 0) {
      this.detritus = detritus;
      this.addRow();
    } else {
      this.detritus = detritus;
    }
  }

  BromeliadDetritusEditC.prototype.help = function(section) {
    console.log(section);
    return this.BromeliadHelp[section];
  };

  BromeliadDetritusEditC.prototype.addRow = function() {
    return this.detritus.push({
      min: '',
      max: '',
      mass: ''
    });
  };

  BromeliadDetritusEditC.prototype.removeRow = function(i) {
    return this.detritus.splice(i, 1);
  };

  BromeliadDetritusEditC.prototype.done = function() {
    return this.$scope.confirm(this.validateDetritus());
  };

  BromeliadDetritusEditC.prototype.isEmpty = function(value) {
    return !value || value.trim().length === 0;
  };

  BromeliadDetritusEditC.prototype.validateDetritus = function() {
    var detritus, i, j, k, l, lastMax, len, len1, len2, ref, ref1, removals, trimmedDetritus;
    if (!(this.detritus.length > 0)) {
      return;
    }
    lastMax = null;
    removals = [];
    ref = this.detritus;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      detritus = ref[i];
      if (this.isEmpty(detritus.min) && this.isEmpty(detritus.max) && this.isEmpty(detritus.mass)) {
        removals.push(i);
      }
    }
    trimmedDetritus = [];
    ref1 = this.detritus;
    for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
      detritus = ref1[i];
      if (indexOf.call(removals, i) < 0) {
        trimmedDetritus.push(detritus);
      }
    }
    for (i = l = 0, len2 = trimmedDetritus.length; l < len2; i = ++l) {
      detritus = trimmedDetritus[i];
      if (this.isEmpty(detritus.min)) {
        if (i !== 0) {
          throw new Error("<b>min</b> of a row must not be empty, unless it is the first row");
        }
      }
      if (this.isEmpty(detritus.max)) {
        if (i !== this.detritus.length - 1) {
          throw new Error("<b>max</b> of a row must not be empty, unless it is the last row");
        }
      }
      if (!this.isEmpty(detritus.min) && !this.isEmpty(detritus.max)) {
        if (parseInt(detritus.max) <= parseInt(detritus.min)) {
          throw new Error("<b>max</b> of a row cannot be smaller than the <b>min</b>");
        }
      }
      if (this.isEmpty(detritus.mass)) {
        throw new Error("<b>mass</b> is missing in a row");
      }
      if (lastMax != null) {
        if (detritus.min !== lastMax) {
          throw new Error("<b>max</b> of a row must follow the <b>min</b> of the last row");
        }
      }
      lastMax = detritus.max;
    }
    return trimmedDetritus;
  };

  return BromeliadDetritusEditC;

})();

app.controller('BromeliadDetritusEditC', BromeliadDetritusEditC);

var BromeliadEditC;

BromeliadEditC = (function() {
  function BromeliadEditC(visit_id, edit, DatasetF, VisitF, BromeliadF, $uibModalInstance, ngDialog, BromeliadHelp) {
    this.DatasetF = DatasetF;
    this.VisitF = VisitF;
    this.BromeliadF = BromeliadF;
    this.BromeliadHelp = BromeliadHelp;
    this.$uibModalInstance = $uibModalInstance;
    this.ngDialog = ngDialog;
    this.attributes = [
      {
        type: '',
        value: ''
      }
    ];
    if (edit) {
      this.edit = this.pruneNA(edit);
      if (edit.attributes) {
        this.loadAttributes(edit.attributes);
      }
      delete this.edit.attributes;
    }
    this.data = {};
    if (!this.edit && visit_id) {
      this.data = {
        visit_id: visit_id,
        detritus: []
      };
    }
    if (this.edit) {
      this.data = this.edit;
    }
    this.loadDatasets();
  }

  BromeliadEditC.prototype.help = function(section) {
    return this.BromeliadHelp[section];
  };

  BromeliadEditC.prototype.cancel = function() {
    return this.$uibModalInstance.dismiss();
  };

  BromeliadEditC.prototype.submit = function() {
    var attributes, data;
    this.validateAttributes(this.attributes);
    attributes = this.parseAttributes(this.attributes);
    data = angular.copy(this.data);
    data.attributes = attributes;
    if (this.edit) {
      return this.BromeliadF.editBromeliad(data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    } else {
      return this.BromeliadF.createBromeliad(data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    }
  };

  BromeliadEditC.prototype.loadDatasets = function() {
    return this.DatasetF.getDatasets().then((function(_this) {
      return function(datasets) {
        _this.datasets = datasets;
        return _this.loadVisits();
      };
    })(this)).then((function(_this) {
      return function() {
        var dataset, j, len, ref, results, visit;
        ref = _this.visits;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          visit = ref[j];
          results.push((function() {
            var l, len1, ref1, results1;
            ref1 = this.datasets;
            results1 = [];
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              dataset = ref1[l];
              if (dataset.dataset_id === visit.dataset_id) {
                results1.push(visit.dataset_name = dataset.name);
              }
            }
            return results1;
          }).call(_this));
        }
        return results;
      };
    })(this));
  };

  BromeliadEditC.prototype.loadVisits = function() {
    return this.VisitF.getVisits().then((function(_this) {
      return function(visits) {
        return _this.visits = visits;
      };
    })(this));
  };

  BromeliadEditC.prototype.pruneNA = function(data) {
    var k, result, v;
    result = {};
    for (k in data) {
      v = data[k];
      result[k] = v === 'NA' ? null : v;
    }
    return result;
  };

  BromeliadEditC.prototype.addAttribute = function() {
    return this.attributes.push({
      type: '',
      value: ''
    });
  };

  BromeliadEditC.prototype.showDetritus = function() {
    if (!this.data.detritus) {
      this.data.detritus = [];
    }
    return this.ngDialog.openConfirm({
      template: 'bromeliad/detritus.html',
      controller: 'BromeliadDetritusEditC',
      controllerAs: 'bromeliad',
      showClose: false,
      resolve: {
        detritus: (function(_this) {
          return function() {
            return _this.data.detritus;
          };
        })(this)
      }
    }).then((function(_this) {
      return function(detritus) {
        return _this.data.detritus = detritus;
      };
    })(this));
  };

  BromeliadEditC.prototype.parseAttributes = function(attributes) {
    var attribute, j, len, obj, ref, ref1;
    obj = {};
    for (j = 0, len = attributes.length; j < len; j++) {
      attribute = attributes[j];
      if (!(((ref = attribute.type) != null ? ref.trim() : void 0) !== '' && ((ref1 = attribute.value) != null ? ref1.trim() : void 0) !== '')) {
        continue;
      }
      obj[attribute.type] = attribute.value;
    }
    return obj;
  };

  BromeliadEditC.prototype.loadAttributes = function(attributes) {
    var results, type, value;
    this.attributes = [];
    results = [];
    for (type in attributes) {
      value = attributes[type];
      results.push(this.attributes.push({
        type: type,
        value: value
      }));
    }
    return results;
  };

  BromeliadEditC.prototype.removeAttribute = function(index) {
    return this.attributes.splice(index, 1);
  };

  BromeliadEditC.prototype.validateAttributes = function(attributes) {
    var i, j, k, ref, results, size;
    if (attributes && attributes.length > 0) {
      size = attributes.length;
      results = [];
      for (i = j = 0, ref = size - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        results.push((function() {
          var l, ref1, results1;
          results1 = [];
          for (k = l = 0, ref1 = size - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; k = 0 <= ref1 ? ++l : --l) {
            if (!(i !== k)) {
              continue;
            }
            if (!(attributes[i].type && attributes[i].value)) {
              continue;
            }
            if (attributes[i].type === attributes[k].type) {
              throw new Error("Duplicate type in attributes");
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    }
  };

  return BromeliadEditC;

})();

app.controller('BromeliadEditC', BromeliadEditC);

app.factory('BromeliadF', function(ApiF, $uibModal) {
  var BromeliadF;
  BromeliadF = {};
  BromeliadF.fields = [
    {
      field: 'dataset_name',
      title: 'Dataset',
      unit: 'name',
      visible: true,
      noEdit: true
    }, {
      field: 'visit_habitat',
      title: 'Visit',
      unit: 'habitat',
      visible: true,
      noEdit: true
    }, {
      field: 'original_id',
      title: 'Original ID',
      visible: true
    }, {
      field: 'species',
      title: 'Species',
      visible: true
    }, {
      field: 'actual_water',
      title: 'Actual water',
      unit: 'ml',
      visible: true,
      format: 'number'
    }, {
      field: 'max_water',
      title: 'Max. water',
      unit: 'ml',
      visible: true,
      format: 'number'
    }, {
      field: 'longest_leaf',
      title: 'Longest leaf',
      unit: 'cm',
      visible: true,
      format: 'number'
    }, {
      field: 'leaf_width',
      title: 'Leaf width',
      unit: 'cm',
      visible: true,
      format: 'number'
    }, {
      field: 'num_leaf',
      title: '# Leaves',
      visible: true,
      format: 'number'
    }, {
      field: 'height',
      title: 'Height',
      unit: 'cm abv. ground',
      visible: true,
      format: 'number'
    }, {
      field: 'diameter',
      title: 'Diameter',
      unit: 'cm',
      visible: true,
      format: 'number'
    }, {
      field: 'extended_diameter',
      title: 'Extended diameter',
      unit: 'cm',
      visible: true,
      format: 'number'
    }, {
      field: 'collection_date',
      title: 'Collection date',
      visible: true,
      format: 'date'
    }
  ];
  BromeliadF.showBromeliad = function(bromeliad_id) {
    return $uibModal.open({
      templateUrl: 'bromeliad/view.html',
      controller: 'BromeliadViewC',
      controllerAs: 'bromeliad',
      resolve: {
        bromeliad_id: function() {
          return bromeliad_id;
        }
      }
    });
  };
  BromeliadF.getBromeliads = function(params) {
    if (params == null) {
      params = {};
    }
    return ApiF.get('bromeliads', 'list', {
      params: params
    });
  };
  BromeliadF.getBromeliadById = function(bromeliad_id) {
    return ApiF.get('bromeliads', 'list', {
      params: {
        bromeliad_id: bromeliad_id
      }
    }).then(function(arg) {
      var bromeliad;
      bromeliad = arg[0];
      return bromeliad;
    });
  };
  BromeliadF.getBromeliadsMap = function(params) {
    if (params == null) {
      params = {};
    }
    return ApiF.get('bromeliads', 'list', {
      params: params
    }).then(function(results) {
      return BromeliadF.mapBromeliads(results);
    });
  };
  BromeliadF.mapBromeliads = function(bromeliads) {
    var bromeliad, i, len, obj;
    obj = {};
    for (i = 0, len = bromeliads.length; i < len; i++) {
      bromeliad = bromeliads[i];
      obj[bromeliad.bromeliad_id] = bromeliad.original_id;
    }
    return obj;
  };
  BromeliadF.deleteBromeliads = function(bromeliads) {
    return ApiF.postWithLoading('bromeliads', 'delete', null, {
      bromeliads: bromeliads
    });
  };
  BromeliadF.createBromeliads = function(bromeliads, loading) {
    var bromeliad, data, i, len;
    if (loading == null) {
      loading = true;
    }
    data = [];
    for (i = 0, len = bromeliads.length; i < len; i++) {
      bromeliad = bromeliads[i];
      if ((bromeliad != null ? bromeliad.visit_id : void 0) == null) {
        throw new Error("A visit must be selected for this bromeliad");
      }
      bromeliad = BromeliadF.omitFields(bromeliad);
      BromeliadF.emptyToNull(bromeliad);
      BromeliadF.normalizeDetritus(bromeliad);
      data.push(bromeliad);
    }
    if (loading) {
      return ApiF.postWithLoading('bromeliads', 'new', null, {
        bromeliads: data
      }, BromeliadF.unmapError);
    } else {
      return ApiF.post('bromeliads', 'new', null, {
        bromeliads: data
      }, BromeliadF.unmapError);
    }
  };
  BromeliadF.createBromeliad = function(bromeliad) {
    return BromeliadF.createBromeliads([bromeliad]);
  };
  BromeliadF.editBromeliad = function(bromeliad) {
    var bromeliad_id, data;
    data = {};
    bromeliad_id = bromeliad.bromeliad_id;
    bromeliad = BromeliadF.omitFields(bromeliad);
    bromeliad = BromeliadF.emptyToNull(bromeliad);
    data[bromeliad_id] = bromeliad;
    return ApiF.postWithLoading('bromeliads', 'edit', null, {
      bromeliads: data
    }, BromeliadF.unmapError);
  };
  BromeliadF.unmapError = function(error) {
    var c, i, len, ref;
    ref = BromeliadF.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      c = ref[i];
      error = error.replace("'" + c.field + "'", "<b>" + c.title + "</b>");
    }
    return error;
  };
  BromeliadF.omitFields = function(bromeliad) {
    return bromeliad = _.omit(bromeliad, 'bromeliad_id');
  };
  BromeliadF.emptyToNull = function(bromeliad) {
    return bromeliad = _.mapObject(bromeliad, function(value) {
      if (typeof value === 'string' && value.trim() === '') {
        return null;
      } else {
        return value;
      }
    });
  };
  BromeliadF.normalizeDetritus = function(bromeliad) {
    var i, len, ref, ref1, results1, row;
    if (!bromeliad.detritus) {
      return;
    }
    ref = bromeliad.detritus;
    results1 = [];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      if ((ref1 = row.mass) === 'NA' || ref1 === '') {
        results1.push(row.mass = null);
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };
  return BromeliadF;
});

var BromeliadUploadC;

BromeliadUploadC = (function() {
  function BromeliadUploadC(visit_id, BromeliadF, BromeliadUploadF, $scope, DialogF, HelpF) {
    this.BromeliadF = BromeliadF;
    this.BromeliadUploadF = BromeliadUploadF;
    this.$scope = $scope;
    this.DialogF = DialogF;
    this.HelpF = HelpF;
    this.visit_id = visit_id;
  }

  BromeliadUploadC.prototype.onUpload = function(file) {
    if (!file) {
      return;
    }
    this.BromeliadUploadF.validateType(file.type);
    this.BromeliadUploadF.validateSize(file.size);
    return this.BromeliadUploadF.validateFile(file).then((function(_this) {
      return function(bromeliads) {
        var bromeliad, i, len;
        for (i = 0, len = bromeliads.length; i < len; i++) {
          bromeliad = bromeliads[i];
          bromeliad.visit_id = _this.visit_id;
        }
        return _this.BromeliadF.createBromeliads(bromeliads);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Bromeliads successfully created");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.$scope.confirm(true);
      };
    })(this));
  };

  BromeliadUploadC.prototype.help = function() {
    return this.HelpF.openHelp('bromeliad-upload');
  };

  return BromeliadUploadC;

})();

app.controller('BromeliadUploadC', BromeliadUploadC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('BromeliadUploadF', function(BromeliadF, FileParserF, ValidatorF, ngDialog) {
  var BromeliadUploadF;
  BromeliadUploadF = {};
  BromeliadUploadF.MAX_SIZE_MB = 10;
  BromeliadUploadF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel'];
  BromeliadUploadF.uploadDialog = function(visit_id) {
    if (visit_id == null) {
      throw new Error("Select a visit from the dropdown first");
    }
    return ngDialog.openConfirm({
      template: 'bromeliad/upload.html',
      controller: 'BromeliadUploadC',
      controllerAs: 'bromeliad',
      resolve: {
        visit_id: function() {
          return visit_id;
        }
      }
    });
  };
  BromeliadUploadF.validateType = function(type) {
    if (indexOf.call(BromeliadUploadF.SUPPORTED_TYPES, type) < 0) {
      throw new Error("File type not supported. Please select a CSV or TSV file.\n File type: " + type);
    }
  };
  BromeliadUploadF.validateSize = function(size) {
    if (size > (BromeliadUploadF.MAX_BYTE_SIZE * 1024 * 1024)) {
      throw new Error("File size exceeded 10MB");
    }
  };
  BromeliadUploadF.validateFile = function(file) {
    return BromeliadUploadF.parseFile(file).then(function(rows) {
      var i, len, mapped, results, row;
      results = [];
      for (i = 0, len = rows.length; i < len; i++) {
        row = rows[i];
        mapped = BromeliadUploadF.mapTitle(row);
        BromeliadUploadF.validateBromeliad(mapped);
        results.push(mapped);
      }
      return results;
    });
  };
  BromeliadUploadF.parseFile = function(file) {
    return FileParserF.parse(file, {
      header: true,
      skipEmptyLines: true
    });
  };
  BromeliadUploadF.mapTitle = function(row) {
    var column, i, k, len, max, min, obj, rangeString, ranges, ref, ref1, ref2, v;
    obj = {};
    ref = BromeliadF.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      column = ref[i];
      if (column.noEdit) {
        if (row[column.field]) {
          throw new Error("File should not contain field: " + column.field);
        } else {
          continue;
        }
      }
      if (row[column.field] == null) {
        throw new Error("Missing field: " + column.field);
      }
      obj[column.field] = row[column.field];
    }
    for (k in obj) {
      v = obj[k];
      if (v === 'NA') {
        obj[k] = null;
      }
    }
    for (k in row) {
      v = row[k];
      if (!(!obj.hasOwnProperty(k))) {
        continue;
      }
      if (!(k.length > 0)) {
        continue;
      }
      if (k.length < 10 || ((ref1 = k.substring(0, 9)) !== 'detritus:' && ref1 !== 'detritus>')) {
        obj.attributes || (obj.attributes = {});
        obj.attributes[k] = v;
      } else {
        if (k.substring(9).length === 0) {
          throw new Error('Missing sieve range for detritus field');
        }
        rangeString = k.substring(9);
        if (k.substring(0, 9) === 'detritus>') {
          ref2 = [rangeString.substring(1), null], min = ref2[0], max = ref2[1];
        } else {
          ranges = rangeString.split("-");
          if (ranges.length !== 2) {
            throw new Error("Detritus field not formatted properly: " + rangeString);
          }
          min = ranges[0], max = ranges[1];
        }
        obj.detritus || (obj.detritus = []);
        obj.detritus.push({
          min: min,
          max: max,
          mass: v
        });
      }
    }
    return obj;
  };
  BromeliadUploadF.validateBromeliad = function(bromeliad) {
    var field, i, len, ref, results1, value;
    if (bromeliad.original_id == null) {
      throw new Error("Missing original_id column");
    }
    ref = BromeliadF.fields;
    results1 = [];
    for (i = 0, len = ref.length; i < len; i++) {
      field = ref[i];
      if (((value = bromeliad[field.field]) != null) && (field.format != null)) {
        switch (field.format) {
          case 'date':
            results1.push(ValidatorF.validateDate(field.title, value));
            break;
          case 'number':
            results1.push(ValidatorF.validateNumber(field.title, value, true));
            break;
          default:
            results1.push(void 0);
        }
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };
  return BromeliadUploadF;
});

var BromeliadViewC;

BromeliadViewC = (function() {
  function BromeliadViewC(bromeliad_id, BromeliadF, $uibModalInstance) {
    this.BromeliadF = BromeliadF;
    this.$uibModalInstance = $uibModalInstance;
    this.loadBromeliad(bromeliad_id);
  }

  BromeliadViewC.prototype.loadBromeliad = function(bromeliad_id) {
    return this.BromeliadF.getBromeliadById(bromeliad_id).then((function(_this) {
      return function(bromeliad) {
        return _this.data = bromeliad;
      };
    })(this));
  };

  BromeliadViewC.prototype.dismiss = function() {
    return this.$uibModalInstance.dismiss();
  };

  return BromeliadViewC;

})();

app.controller('BromeliadViewC', BromeliadViewC);

var DashboardC;

DashboardC = (function() {
  function DashboardC(DashboardF, MarkdownF, HistoryF) {
    this.DashboardF = DashboardF;
    this.MarkdownF = MarkdownF;
    this.HistoryF = HistoryF;
    this.getDashboardInfo();
    this.getAnnouncements();
    this.getHistory();
  }

  DashboardC.prototype.getDashboardInfo = function() {
    return this.DashboardF.getDashboardInfo().then((function(_this) {
      return function(results) {
        return _this.counts = results;
      };
    })(this));
  };

  DashboardC.prototype.getAnnouncements = function() {
    return this.MarkdownF.getMarkdown('dashboard').then((function(_this) {
      return function(markdown) {
        return _this.announcements = markdown;
      };
    })(this));
  };

  DashboardC.prototype.getHistory = function() {
    return this.HistoryF.getHistory({
      page: 1,
      limit: 10,
      comments: true
    }).then((function(_this) {
      return function(history) {
        return _this.history = history;
      };
    })(this));
  };

  return DashboardC;

})();

app.controller('DashboardC', DashboardC);

app.factory('DashboardF', function(ApiF) {
  var DashboardF;
  DashboardF = {};
  DashboardF.getDashboardInfo = function() {
    return ApiF.get('dashboard', 'summary');
  };
  return DashboardF;
});

var DatasetC;

DatasetC = (function() {
  function DatasetC(DatasetF, ngDialog, DialogF, HelpMessageF, $uibModal, $filter, $q) {
    this.DatasetF = DatasetF;
    this.ngDialog = ngDialog;
    this.HelpMessageF = HelpMessageF;
    this.DialogF = DialogF;
    this.$q = $q;
    this.$filter = $filter;
    this.$uibModal = $uibModal;
    this.datasets = [];
    this.loadDatasets();
  }

  DatasetC.prototype.sortField = 'country';

  DatasetC.prototype.orderBy = 'asc';

  DatasetC.prototype.sortable = [
    {
      field: 'country',
      label: 'Country',
      icon: 'fa-globe'
    }, {
      field: 'year',
      label: 'Year',
      icon: 'fa-calendar'
    }, {
      field: 'num_species',
      label: '# Species',
      icon: 'fa-bug'
    }, {
      field: 'num_bromeliads',
      label: '# Bromeliads',
      icon: 'fa-tree'
    }
  ];

  DatasetC.prototype.newDatasetDialog = function() {
    var modal;
    modal = this.$uibModal.open({
      templateUrl: 'dataset/edit.html',
      controller: 'DatasetEditC',
      controllerAs: 'dataset',
      resolve: {
        edit: (function(_this) {
          return function() {
            return null;
          };
        })(this)
      }
    });
    return modal.result.then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Dataset successfully created");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadDatasets();
      };
    })(this));
  };

  DatasetC.prototype.edit = function(dataset) {
    var modal;
    modal = this.$uibModal.open({
      templateUrl: 'dataset/edit.html',
      controller: 'DatasetEditC',
      controllerAs: 'dataset',
      resolve: {
        edit: (function(_this) {
          return function() {
            return angular.copy(dataset);
          };
        })(this)
      }
    });
    return modal.result.then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Dataset successfully updated");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadDatasets();
      };
    })(this));
  };

  DatasetC.prototype.help = function(message) {
    return this.HelpMessageF.getHelp('Dataset', message);
  };

  DatasetC.prototype.loadDatasets = function() {
    return this.DatasetF.getDatasets().then((function(_this) {
      return function(datasets) {
        _this.datasets = datasets;
        return _this.sort();
      };
    })(this));
  };

  DatasetC.prototype["delete"] = function(dataset) {
    return this.confirmDelete(dataset).then((function(_this) {
      return function() {
        return _this.DatasetF.deleteDataset(dataset.dataset_id);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Dataset successfully removed");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadDatasets();
      };
    })(this));
  };

  DatasetC.prototype.confirmDelete = function(dataset) {
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return "Enter name of dataset";
        },
        message: (function(_this) {
          return function() {
            return "<b>" + dataset.name + "</b> and all its visits, bromeliads and measurements will be deleted. Proceed?";
          };
        })(this)
      }
    }).then(function(confirmText) {
      if (confirmText && confirmText === dataset.name) {
        return true;
      } else {
        throw new Error("Dataset name entered does not match its record. <br>Please try again!");
        return this.$q.reject();
      }
    });
  };

  DatasetC.prototype.sort = function(field, order) {
    var asc;
    if (field == null) {
      field = this.sortField;
    }
    if (order == null) {
      order = this.orderBy;
    }
    console.log("sort called " + this.sortField + " " + order);
    this.sortField = field;
    asc = order === 'asc';
    return this.datasets = this.$filter('orderBy')(this.datasets, field, !asc);
  };

  DatasetC.prototype.order = function(order) {
    this.orderBy = order;
    return this.datasets = this.sort(this.sortField, order);
  };

  return DatasetC;

})();

app.controller('DatasetC', DatasetC);

var DatasetEditC;

DatasetEditC = (function() {
  function DatasetEditC(edit, DatasetF, $uibModalInstance, ConstantsF) {
    this.COUNTRIES = ConstantsF.COUNTRIES;
    if (edit != null) {
      this.data = edit;
      this.edit = true;
    }
    this.DatasetF = DatasetF;
    this.$uibModalInstance = $uibModalInstance;
  }

  DatasetEditC.prototype.submit = function() {
    if (this.edit) {
      return this.DatasetF.editDataset(this.data.dataset_id, this.data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    } else {
      return this.DatasetF.createDataset(this.data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    }
  };

  DatasetEditC.prototype.cancel = function() {
    return this.$uibModalInstance.dismiss();
  };

  return DatasetEditC;

})();

app.controller('DatasetEditC', DatasetEditC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('DatasetF', function(ApiF, $q, ngDialog, DialogF, ValidatorF, $uibModal) {
  var DatasetF, _omitEmptyFields, _validateDataset;
  DatasetF = {};
  DatasetF.editingMatrix = false;
  DatasetF.matrixData = {};
  DatasetF.fieldMap = {
    name: 'Name',
    year: 'Year',
    country: 'Country',
    location: 'Location',
    lat: 'Latitude',
    lng: 'Longitude'
  };
  DatasetF.getDataset = function(dataset_id) {
    return ApiF.get('datasets', 'list', {
      params: {
        dataset_id: dataset_id
      }
    }).then(function(results) {
      if (results.length === 1) {
        return results[0];
      } else {
        throw new Error("Dataset not found");
      }
    });
  };
  DatasetF.getDatasets = function() {
    return ApiF.get('datasets', 'list', null);
  };
  DatasetF.editDialog = function(dataset) {
    var modal;
    modal = $uibModal.open({
      templateUrl: 'dataset/edit.html',
      controller: 'DatasetEditC',
      controllerAs: 'dataset',
      resolve: {
        edit: (function(_this) {
          return function() {
            return angular.copy(dataset);
          };
        })(this)
      }
    });
    return modal.result.then((function(_this) {
      return function() {
        return DialogF.successDialog("Dataset successfully updated");
      };
    })(this));
  };
  DatasetF.deleteDataset = function(dataset_id) {
    return ApiF.postWithLoading('datasets', 'delete', null, {
      datasets: [dataset_id]
    });
  };
  DatasetF.unmapError = function(message) {
    var error, k, ref, v;
    ref = DatasetF.fieldMap;
    for (k in ref) {
      v = ref[k];
      error = message.replace("Field '" + k + "'", v);
    }
    return message;
  };
  DatasetF.createDataset = function(dataset) {
    dataset = _omitEmptyFields(dataset);
    _validateDataset(dataset);
    return ApiF.postWithLoading('datasets', 'new', null, {
      datasets: [dataset]
    }, DatasetF.unmapError);
  };
  DatasetF.editDataset = function(dataset_id, dataset) {
    var data;
    if (!dataset_id) {
      throw new Error("Missing dataset_id");
    }
    data = {};
    data[dataset_id] = _omitEmptyFields(dataset);
    _validateDataset(data[dataset_id]);
    return ApiF.postWithLoading('datasets', 'edit', null, {
      datasets: data
    }, DatasetF.unmapError);
  };
  _omitEmptyFields = function(data) {
    var dataset;
    return dataset = {
      name: data.name,
      year: data.year,
      country: data.country,
      location: data.location,
      lat: data.lat && data.lat.length > 0 ? data.lat : 'NA',
      lng: data.lng && data.lng.length > 0 ? data.lng : 'NA',
      owner_name: data.owner_name && data.owner_name.length > 0 ? data.owner_name : 'NA',
      owner_email: data.owner_email && data.owner_email.length > 0 ? data.owner_email : 'NA',
      owner2_name: data.owner2_name && data.owner2_name.length > 0 ? data.owner2_name : 'NA',
      owner2_email: data.owner2_email && data.owner2_email.length > 0 ? data.owner2_email : 'NA',
      bwg_release: data.bwg_release && data.bwg_release.length > 0 ? data.bwg_release : null,
      public_release: data.public_release && data.public_release.length > 0 ? data.public_release : null,
      faculty_name: data.faculty_name && data.faculty_name.length > 0 ? data.faculty_name : 'NA',
      faculty_email: data.faculty_email && data.faculty_email.length > 0 ? data.faculty_email : 'NA'
    };
  };
  _validateDataset = function(dataset) {
    var field, i, lat, len, lng, required;
    required = ['name', 'year', 'country', 'location'];
    for (i = 0, len = required.length; i < len; i++) {
      field = required[i];
      if (!((dataset != null ? dataset[field] : void 0) && dataset[field].length > 0)) {
        throw new Error("Missing required field " + field);
      }
    }
    if (indexOf.call(required, "year") >= 0 && dataset.year < 1900 || dataset.year > 2100) {
      throw new Error("Year must be between 1900 and 2100");
    }
    if (lat = dataset['lat'] && lat !== 'NA') {
      ValidatorF.validateLat(lat);
    }
    if (lng = dataset['lng'] && lat !== 'NA') {
      return ValidatorF.validateLng(lng);
    }
  };
  return DatasetF;
});

var DatasetMatrixC;

DatasetMatrixC = (function() {
  function DatasetMatrixC(DatasetF, MatrixF, BromeliadF, SpeciesF, $stateParams, $state, $scope) {
    this.MatrixF = MatrixF;
    this.BromeliadF = BromeliadF;
    this.dataset_id = $stateParams.dataset_id;
    this.DatasetF = DatasetF;
    this.showSpecies = SpeciesF.showSpecies;
    this.showBromeliad = BromeliadF.showBromeliad;
    this.loadData();
    $scope.$watch((function() {
      return MatrixF.editingMatrix;
    }), (function(_this) {
      return function(n, o) {
        if (o && !n) {
          return _this.loadData();
        }
      };
    })(this));
  }

  DatasetMatrixC.prototype.loadData = function() {
    return this.loadBromeliads().then((function(_this) {
      return function() {
        return _this.loadMatrix();
      };
    })(this)).then((function(_this) {
      return function() {
        return console.log(_this);
      };
    })(this));
  };

  DatasetMatrixC.prototype.loadMatrix = function() {
    return this.MatrixF.getMatrix(this.dataset_id).then((function(_this) {
      return function(matrix) {
        return _this.matrix = matrix;
      };
    })(this));
  };

  DatasetMatrixC.prototype.loadBromeliads = function() {
    return this.BromeliadF.getBromeliads({
      dataset_id: this.dataset_id
    }).then((function(_this) {
      return function(bromeliads) {
        return _this.bromeliads = bromeliads;
      };
    })(this));
  };

  DatasetMatrixC.prototype.isEditingMatrix = function() {
    return this.MatrixF.editingMatrix;
  };

  DatasetMatrixC.prototype.isMissingBromeliads = function() {
    return this.MatrixF.noBromeliads;
  };

  DatasetMatrixC.prototype.isEmpty = function(obj) {
    if (!obj) {
      return false;
    }
    return Object.keys(obj).length === 0;
  };

  return DatasetMatrixC;

})();

app.controller('DatasetMatrixC', DatasetMatrixC);

var DatasetMeasurementsC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

DatasetMeasurementsC = (function() {
  function DatasetMeasurementsC(DatasetF, MeasurementF, $stateParams, $uibModal, ngDialog, DialogF, SpeciesF) {
    this.measurements = {};
    this.DatasetF = DatasetF;
    this.MeasurementF = MeasurementF;
    this.dataset_id = $stateParams.dataset_id;
    this.$uibModal = $uibModal;
    this.ngDialog = ngDialog;
    this.DialogF = DialogF;
    this.showSpecies = SpeciesF.showSpecies;
    this.loadMeasurements();
  }

  DatasetMeasurementsC.prototype.loadMeasurements = function() {
    return this.MeasurementF.getMeasurements(this.dataset_id).then((function(_this) {
      return function(results) {
        return _this.measurements = results;
      };
    })(this));
  };

  DatasetMeasurementsC.prototype["new"] = function() {
    var modal;
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurement.<br> Save or discard them before adding new species");
    }
    modal = this.$uibModal.open({
      templateUrl: 'measurements/new.html',
      controller: 'MeasurementNewC',
      controllerAs: 'measurement',
      resolve: {
        dataset_id: (function(_this) {
          return function() {
            return _this.dataset_id;
          };
        })(this),
        existingSpecies: (function(_this) {
          return function() {
            var j, len, m, ref, results1;
            if (_this.measurements) {
              ref = _this.measurements;
              results1 = [];
              for (j = 0, len = ref.length; j < len; j++) {
                m = ref[j];
                results1.push(m.species_id);
              }
              return results1;
            } else {
              return [];
            }
          };
        })(this)
      }
    });
    return modal.result.then((function(_this) {
      return function(added) {
        var j, len, ref, results1, s;
        if (added && added.length > 0) {
          _this.newSpecies = angular.copy(added);
          ref = _this.newSpecies;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            s = ref[j];
            results1.push(_this.newMeasurementRow(s));
          }
          return results1;
        }
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.newMeasurementRow = function(species) {
    species.measurements || (species.measurements = []);
    if (species.category_range === 'category') {
      return species.measurements.push({
        category: '',
        wet: false,
        biomass: ''
      });
    } else if (species.category_range === 'range') {
      return species.measurements.push({
        min: '',
        max: '',
        wet: false,
        biomass: ''
      });
    }
  };

  DatasetMeasurementsC.prototype.removeMeasurement = function(species, ind) {
    species.measurements.splice(ind, 1);
    if (species.measurements.length === 0) {
      return this.newMeasurementRow(species);
    }
  };

  DatasetMeasurementsC.prototype.removeAddedSpecies = function(species) {
    return this.DialogF.confirmDialog("Measurements for <b>" + species.bwg_name + "</b> will be discarded. Proceed?").then((function(_this) {
      return function() {
        var i, j, len, ref, results1, s;
        ref = _this.newSpecies;
        results1 = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          s = ref[i];
          if (species.species_id === s.species_id) {
            results1.push(_this.newSpecies.splice(i, 1));
          }
        }
        return results1;
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.discardNew = function() {
    return this.DialogF.confirmDialog("Measurements for all added species will be discarded. Proceed?").then((function(_this) {
      return function() {
        return _this.newSpecies = null;
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.saveNew = function() {
    var data, j, k, len, len1, m, mObj, measurements, omitted, ref, ref1, species;
    data = {};
    ref = this.newSpecies;
    for (j = 0, len = ref.length; j < len; j++) {
      species = ref[j];
      omitted = this._omitEmptyMeasurements(species.category_range, species.measurements);
      if (omitted.length === 0) {
        species.category_range = 'category';
        omitted = [
          {
            category: 'default'
          }
        ];
      }
      species.measurements = omitted;
      measurements = [];
      ref1 = species.measurements;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        m = ref1[k];
        if (species.category_range === 'range') {
          if (!m.min || m.min.trim().length === 0) {
            throw new Error("<b>min</b> missing for species <b>" + species.bwg_name + "</b>");
          }
          if (!m.max || m.max.trim().length === 0) {
            throw new Error("<b>max</b> missing for species <b>" + species.bwg_name + "</b>");
          }
          if (!m.unit || m.unit.trim().length === 0) {
            throw new Error("<b>unit</b> missing for species <b>" + species.bwg_name + "</b>");
          }
          mObj = {
            min: m.min,
            max: m.max,
            unit: m.unit
          };
        } else {
          mObj = {
            value: m.category
          };
        }
        if (m.biomass && m.biomass.trim().length > 0) {
          mObj.biomass = {
            value: m.biomass,
            unit: species.unit,
            dry_wet: m.wet ? 'wet' : 'dry'
          };
        }
        measurements.push(mObj);
      }
      if (species.category_range === 'range') {
        data[species.species_id] = {
          ranges: measurements
        };
      } else {
        data[species.species_id] = {
          categories: measurements
        };
      }
    }
    return this.MeasurementF.createMeasurements(this.dataset_id, data).then((function(_this) {
      return function() {
        _this.newSpecies = null;
        return _this.DialogF.successDialog("Species successfully added to the dataset");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadMeasurements();
      };
    })(this));
  };

  DatasetMeasurementsC.prototype._omitEmptyMeasurements = function(category_range, measurements) {
    var i, j, len, m, removals;
    removals = [];
    for (i = j = 0, len = measurements.length; j < len; i = ++j) {
      m = measurements[i];
      if (category_range === 'category') {
        if (!m.category || m.category.trim().length === 0) {
          removals.push(i);
        }
      }
      if (category_range === 'range') {
        if ((!m.min || m.min.trim().length === 0) && (!m.max || m.max.trim().length === 0)) {
          removals.push(i);
        }
      }
    }
    return (function() {
      var k, len1, results1;
      results1 = [];
      for (i = k = 0, len1 = measurements.length; k < len1; i = ++k) {
        m = measurements[i];
        if (indexOf.call(removals, i) < 0) {
          results1.push(m);
        }
      }
      return results1;
    })();
  };

  DatasetMeasurementsC.prototype.edit = function(category, measurement) {
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurements.<br> Save or discard them before editing existing measurements");
    }
    return this.ngDialog.openConfirm({
      templateUrl: 'measurements/edit.html',
      controller: 'MeasurementEditC',
      controllerAs: 'measurement',
      resolve: {
        category: (function(_this) {
          return function() {
            return category;
          };
        })(this),
        measurement: (function(_this) {
          return function() {
            return angular.copy(measurement);
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Measurement successfully updated");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadMeasurements();
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.addMeasurement = function(category, species_id) {
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurements.<br> Save or discard them before editing existing measurements");
    }
    return this.ngDialog.openConfirm({
      templateUrl: 'measurements/edit.html',
      controller: 'MeasurementEditC',
      controllerAs: 'measurement',
      resolve: {
        category: (function(_this) {
          return function() {
            return category;
          };
        })(this),
        measurement: (function(_this) {
          return function() {
            return {
              add: true,
              species_id: species_id,
              dataset_id: _this.dataset_id
            };
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Measurement successfully added");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadMeasurements();
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.deleteMeasurement = function(measurement_id) {
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurements.<br> Save or discard them before removing existing measurements");
    }
    return this.DialogF.confirmDialog("Measurement and <b>ALL</b> associated abundance counts will be deleted. Proceed?").then((function(_this) {
      return function() {
        return _this.MeasurementF.removeMeasurementById(measurement_id);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("Measurement successfully deleted");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadMeasurements();
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.remove = function(species) {
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurements.<br> Save or discard them before removing existing species");
    }
    return this.DialogF.confirmDialog("Measurements for <b>" + species.bwg_name + "</b> will be deleted. Proceed?").then((function(_this) {
      return function() {
        return _this.MeasurementF.removeMeasurements(_this.dataset_id, species.species_id);
      };
    })(this)).then((function(_this) {
      return function() {
        _this.loadMeasurements();
        return _this.DialogF.successDialog("Measurements for <b>" + species.bwg_name + "</b> successfully deleted");
      };
    })(this));
  };

  DatasetMeasurementsC.prototype.removeAll = function() {
    if (this.newSpecies && this.newSpecies.length > 0) {
      throw new Error("There are unsaved species measurements.<br> Save or discard them before removing existing species");
    }
    return this.DialogF.confirmDialog("All measurements and <b>ALL</b> associated abundance counts will be removed. Proceed?").then((function(_this) {
      return function() {
        return _this.MeasurementF.removeMeasurements(_this.dataset_id);
      };
    })(this)).then((function(_this) {
      return function() {
        _this.loadMeasurements();
        return _this.DialogF.successDialog("All measurements successfully removed");
      };
    })(this));
  };

  return DatasetMeasurementsC;

})();

app.controller('DatasetMeasurementsC', DatasetMeasurementsC);

var DatasetOverviewC;

DatasetOverviewC = (function() {
  function DatasetOverviewC(DatasetF, VisitF, BromeliadF, $stateParams, $state, DialogF) {
    this.DatasetF = DatasetF;
    this.VisitF = VisitF;
    this.BromeliadF = BromeliadF;
    this.DialogF = DialogF;
    this.visitFields = VisitF.fields;
    this.bromeliadFields = BromeliadF.fields;
    this.dataset_id = $stateParams.dataset_id;
    this.$state = $state;
    this.data = {};
    this.showBromeliad = BromeliadF.showBromeliad;
    this.visits = [];
    this.bromeliads = [];
    this.selectedVisit = null;
    this.loadDataset();
    this.loadVisits().then((function(_this) {
      return function() {
        return _this.loadBromeliads();
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.populateVisitHabitat();
      };
    })(this));
  }

  DatasetOverviewC.prototype.loadDataset = function() {
    return this.DatasetF.getDataset(this.dataset_id).then((function(_this) {
      return function(dataset) {
        return _this.data = dataset;
      };
    })(this));
  };

  DatasetOverviewC.prototype.loadVisits = function() {
    return this.VisitF.getVisits(this.dataset_id).then((function(_this) {
      return function(visits) {
        return _this.visits = visits;
      };
    })(this));
  };

  DatasetOverviewC.prototype.loadBromeliads = function(visit_id) {
    var params;
    params = visit_id != null ? {
      visit_id: visit_id
    } : {
      dataset_id: this.dataset_id
    };
    return this.BromeliadF.getBromeliads(params).then((function(_this) {
      return function(bromeliads) {
        return _this.bromeliads = bromeliads;
      };
    })(this));
  };

  DatasetOverviewC.prototype.populateVisitHabitat = function() {
    var bromeliad, i, len, ref, results;
    ref = this.bromeliads;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      bromeliad = ref[i];
      results.push(bromeliad.visit_habitat = (function(_this) {
        return function() {
          var j, len1, ref1, v;
          ref1 = _this.visits;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            v = ref1[j];
            if (v.visit_id === bromeliad.visit_id) {
              return v.habitat;
            }
          }
        };
      })(this)());
    }
    return results;
  };

  DatasetOverviewC.prototype.filterBromeliads = function(visit_id) {
    var b;
    if (!(this.bromeliads.length > 0)) {
      return [];
    }
    return (function() {
      var i, len, ref, results;
      ref = this.bromeliads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        b = ref[i];
        if (b.visit_id === visit_id) {
          results.push(b);
        }
      }
      return results;
    }).call(this);
  };

  DatasetOverviewC.prototype.getBromeliads = function() {
    if (this.selectedVisit != null) {
      return this.filterBromeliads(this.selectedVisit);
    } else {
      return this.bromeliads;
    }
  };

  DatasetOverviewC.prototype.viewBromeliads = function() {
    if (this.selectedVisit) {
      return this.$state.go('bromeliad', {
        visit_id: this.selectedVisit
      });
    } else {
      return this.$state.go('bromeliad', {
        dataset_id: this.dataset_id
      });
    }
  };

  DatasetOverviewC.prototype.toggleVisit = function(visit) {
    return this.selectedVisit = visit.visit_id === this.selectedVisit ? null : visit.visit_id;
  };

  DatasetOverviewC.prototype.isVisitSelected = function(visit) {
    return visit.visit_id === this.selectedVisit;
  };

  DatasetOverviewC.prototype.getSelectedVisit = function() {
    var i, len, ref, visit;
    ref = this.visits;
    for (i = 0, len = ref.length; i < len; i++) {
      visit = ref[i];
      if (visit.visit_id === this.selectedVisit) {
        return visit;
      }
    }
  };

  DatasetOverviewC.prototype.hasBromeliads = function() {
    var ref;
    return !this.selectedVisit && ((ref = this.getBromeliads()) != null ? ref.length : void 0) > 0;
  };

  return DatasetOverviewC;

})();

app.controller('DatasetOverviewC', DatasetOverviewC);

var DatasetViewC;

DatasetViewC = (function() {
  function DatasetViewC(DatasetF, $stateParams, $window, $state, DialogF, MatrixF) {
    this.DatasetF = DatasetF;
    this.DialogF = DialogF;
    this.dataset_id = $stateParams.dataset_id;
    this.$window = $window;
    this.$state = $state;
    this.MatrixF = MatrixF;
    this.loadDataset();
  }

  DatasetViewC.prototype.back = function() {
    return this.$state.go('dataset');
  };

  DatasetViewC.prototype.edit = function() {
    return this.DatasetF.editDialog(this.data).then((function(_this) {
      return function() {
        return _this.$state.reload();
      };
    })(this));
  };

  DatasetViewC.prototype.offline = function() {
    return this.MatrixF.offline(this.dataset_id);
  };

  DatasetViewC.prototype.editMatrix = function(finish) {
    if (finish == null) {
      finish = false;
    }
    return this.MatrixF.editMatrix(finish);
  };

  DatasetViewC.prototype.isEditingMatrix = function() {
    return this.MatrixF.editingMatrix;
  };

  DatasetViewC.prototype.isMissingBromeliads = function() {
    return this.MatrixF.noBromeliads;
  };

  DatasetViewC.prototype.loadDataset = function() {
    return this.DatasetF.getDataset(this.dataset_id).then((function(_this) {
      return function(dataset) {
        return _this.data = dataset;
      };
    })(this));
  };

  return DatasetViewC;

})();

app.controller('DatasetViewC', DatasetViewC);

app.factory('HelpMessageF', function(ConstantsF, $http, $q) {
  var HelpMessageF, _cache;
  HelpMessageF = {};
  _cache = null;
  HelpMessageF.fetchHelp = function() {
    return $http.get(ConstantsF.API_PATH + "/help.json").then(function(res) {
      return _cache = res.data;
    })["catch"](function(err) {
      throw new Error(err);
    });
  };
  HelpMessageF.getHelp = function(area, button) {
    var ref;
    return _cache != null ? (ref = _cache[area]) != null ? ref[button] : void 0 : void 0;
  };
  return HelpMessageF;
});

var HistoryC,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

HistoryC = (function() {
  function HistoryC(HistoryF) {
    this.onSubmitComment = bind(this.onSubmitComment, this);
    this.HistoryF = HistoryF;
    this.loadHistory();
  }

  HistoryC.prototype.loadHistory = function() {
    return this.HistoryF.getHistory({
      comments: true
    }).then((function(_this) {
      return function(logs) {
        return _this.data = logs;
      };
    })(this));
  };

  HistoryC.prototype.onSubmitComment = function(log_id, comment) {
    return this.HistoryF.leaveComment(log_id, comment).then((function(_this) {
      return function() {
        return _this.loadHistory();
      };
    })(this));
  };

  return HistoryC;

})();

app.controller('HistoryC', HistoryC);

app.factory('HistoryF', function(ApiF) {
  var DAY, HOUR, HistoryF, MINUTE;
  HistoryF = {};
  MINUTE = 60;
  HOUR = MINUTE * 60;
  DAY = HOUR * 24;
  HistoryF.getHistory = function(params) {
    var options;
    if (params == null) {
      params = {};
    }
    options = {
      params: params
    };
    return ApiF.get('logs', 'list', options).then(function(results) {
      return results.logs;
    });
  };
  HistoryF.getDatasetInfo = function(log) {
    var ref;
    if ((ref = log.type) !== 'matrix' && ref !== 'visits' && ref !== 'bromeliads' && ref !== 'measurements') {
      return null;
    }
    if (!(log[log.type] && log[log.type].length > 0)) {
      return null;
    }
    if (log[log.type].length === 1) {
      return {
        dataset_id: log[log.type][0].dataset_id,
        dataset_name: log[log.type][0].dataset_name
      };
    } else {
      return {
        num_datasets: log[log.type].length
      };
    }
  };
  HistoryF.leaveComment = function(log_id, comment) {
    return ApiF.post('logs', 'comment', {
      params: {
        log_id: log_id
      }
    }, {
      comment: comment
    });
  };
  HistoryF.parseAction = function(action) {
    switch (action) {
      case 'create':
        return 'added';
      case 'edit':
        return 'updated';
      case 'delete':
        return 'removed';
    }
  };
  HistoryF.parseTime = function(timestamp) {
    var current, d, date, days, diff, h, hours, m, mi, minutes, ref, ref1, ref2, s, time, y;
    ref = timestamp.split(" "), date = ref[0], time = ref[1];
    ref1 = date.split("-"), y = ref1[0], m = ref1[1], d = ref1[2];
    ref2 = time.split(":"), h = ref2[0], mi = ref2[1], s = ref2[2];
    date = new Date(y, m - 1, d, h, mi, s);
    current = new Date();
    diff = Math.floor((current.getTime() - date.getTime()) / 1000);
    if (diff < MINUTE) {
      return diff + " seconds ago";
    }
    if (diff < HOUR) {
      minutes = Math.floor(diff / 60);
      return minutes + " minutes ago";
    }
    if (diff < DAY) {
      hours = Math.floor(diff / 60 / 60);
      return hours + " hours ago";
    }
    days = Math.floor(diff / 60 / 60 / 24);
    return days + " days ago";
  };
  return HistoryF;
});

app.directive('timelineD', function(HistoryF, SpeciesF, VisitF, BromeliadF, AvatarF) {
  return {
    restrict: 'EAC',
    templateUrl: 'history/timeline.html',
    scope: {
      history: '=history',
      comments: '=comments',
      submitComment: '=onSubmitComment'
    },
    link: function(scope, element, attrs) {
      scope.parseAction = HistoryF.parseAction;
      scope.parseTime = HistoryF.parseTime;
      scope.getDatasetInfo = HistoryF.getDatasetInfo;
      scope.logGlyphClass = function(log) {
        if (!log.type) {
          return;
        }
        switch (log.type) {
          case "species":
            return {
              "fa-bug": 1,
              "bg-green": 1
            };
          case "datasets":
            return {
              "fa-list-alt": 1,
              "bg-blue": 1
            };
          case "visits":
            return {
              "fa-map-marker": 1,
              "bg-yellow": 1
            };
          case "bromeliads":
            return {
              "fa-tree": 1,
              "bg-purple": 1
            };
          case "measurements":
            return {
              "fa-arrows-h": 1,
              "bg-teal": 1
            };
          case "matrix":
            return {
              "fa-cubes": 1,
              "bg-fuchsia": 1
            };
        }
      };
      scope.viewSpecies = function(species_id) {
        return SpeciesF.showSpecies(species_id);
      };
      scope.viewVisit = function(visit_id) {
        return VisitF.showVisit(visit_id);
      };
      scope.viewBromeliad = function(bromeliad_id) {
        return BromeliadF.showBromeliad(bromeliad_id);
      };
      return scope.getAvatarSrc = AvatarF.getSrcPath;
    }
  };
});

app.factory('MatrixF', function(ApiF, DialogF, ngDialog, BromeliadF, $q) {
  var MatrixF;
  MatrixF = {};
  MatrixF.getMatrix = function(dataset_id) {
    return ApiF.get('matrix', 'list', {
      params: {
        dataset_id: dataset_id
      }
    }).then(function(matrix) {
      MatrixF.noBromeliads = false;
      MatrixF.setEditData(matrix);
      return matrix;
    })["catch"](function(err) {
      if (err === 'NO_BROMELIADS') {
        return MatrixF.noBromeliads = true;
      } else {
        throw new Error(err);
      }
    });
  };
  MatrixF.editingMatrix = false;
  MatrixF.editData = {};
  MatrixF.setEditData = function(matrix) {
    var bromeliads, count, k, measurement, measurement_id, ref, results, species, species_id;
    ref = matrix.species;
    results = [];
    for (species_id in ref) {
      species = ref[species_id];
      results.push((function() {
        var ref1, ref2, results1;
        ref1 = species.measurements;
        results1 = [];
        for (measurement_id in ref1) {
          measurement = ref1[measurement_id];
          bromeliads = {};
          ref2 = measurement.bromeliads;
          for (k in ref2) {
            count = ref2[k];
            bromeliads[k] = count === 'NA' ? '' : count;
          }
          results1.push(MatrixF.editData[measurement_id] = {
            bromeliads: bromeliads
          });
        }
        return results1;
      })());
    }
    return results;
  };
  MatrixF.editMatrix = function(finish) {
    var data;
    if (finish == null) {
      finish = false;
    }
    if (finish) {
      data = angular.copy(MatrixF.editData);
      return DialogF.confirmDialog("Matrix will be updated. Proceed?").then(function() {
        return MatrixF.updateMatrix(data);
      }).then(function() {
        DialogF.successDialog("Matrix successfully updated");
        MatrixF.editData = {};
        return MatrixF.editingMatrix = false;
      })["catch"](function() {
        MatrixF.editData = {};
        return MatrixF.editingMatrix = false;
      });
    } else {
      return MatrixF.editingMatrix = true;
    }
  };
  MatrixF.updateMatrix = function(data) {
    data = MatrixF.omitEmpty(data);
    return ApiF.postWithLoading('matrix', 'edit', null, {
      measurements: data
    });
  };
  MatrixF.omitEmpty = function(data) {
    var bromeliad_id, count, measurement, measurement_id, omitted, ref;
    omitted = {};
    for (measurement_id in data) {
      measurement = data[measurement_id];
      ref = measurement.bromeliads;
      for (bromeliad_id in ref) {
        count = ref[bromeliad_id];
        if ((count != null ? count.trim() : void 0) === '') {
          count = 'NA';
        }
        omitted[measurement_id] || (omitted[measurement_id] = {
          bromeliads: {}
        });
        omitted[measurement_id].bromeliads[bromeliad_id] = count;
      }
    }
    return omitted;
  };
  MatrixF.offline = function(dataset_id) {
    return DialogF.confirmDialog("Unsaved changes will be reverted. Proceed?").then((function(_this) {
      return function() {
        var promises;
        promises = [
          MatrixF.getMatrix(dataset_id), BromeliadF.getBromeliadsMap({
            dataset_id: dataset_id
          })
        ];
        return $q.all(promises).then(function(arg) {
          var bromeliads, matrix;
          matrix = arg[0], bromeliads = arg[1];
          return MatrixF.offlineDialog(matrix, bromeliads);
        }).then(function(measurements) {
          return MatrixF.applyUpload(measurements);
        });
      };
    })(this));
  };
  MatrixF.applyUpload = function(measurements) {
    var bromeliad_id, measurement, measurement_id, newValue, ref, results, value;
    ref = MatrixF.editData;
    results = [];
    for (measurement_id in ref) {
      measurement = ref[measurement_id];
      results.push((function() {
        var ref1, results1;
        ref1 = measurement.bromeliads;
        results1 = [];
        for (bromeliad_id in ref1) {
          value = ref1[bromeliad_id];
          newValue = measurements[measurement_id][bromeliad_id];
          results1.push(MatrixF.editData[measurement_id].bromeliads[bromeliad_id] = newValue);
        }
        return results1;
      })());
    }
    return results;
  };
  MatrixF.offlineDialog = function(matrix, bromeliads) {
    return ngDialog.openConfirm({
      template: 'matrix/offline.html',
      controller: 'MatrixOfflineC',
      controllerAs: 'matrix',
      resolve: {
        matrix: function() {
          return matrix;
        },
        bromeliads: function() {
          return bromeliads;
        }
      }
    });
  };
  return MatrixF;
});

var MatrixOfflineC;

MatrixOfflineC = (function() {
  function MatrixOfflineC(MatrixOfflineF, matrix, bromeliads, DialogF, $scope, $q) {
    var file;
    this.MatrixOfflineF = MatrixOfflineF;
    this.matrix = matrix;
    this.bromeliads = bromeliads;
    this.DialogF = DialogF;
    this.$scope = $scope;
    this.$q = $q;
    if (Object.keys(this.matrix).length === 0) {
      throw new Error("Add at least 1 measurement to edit matrix");
    }
    file = encodeURIComponent(this.getFile());
    this.link = 'data:text/csv;charset=utf-8,' + file;
  }

  MatrixOfflineC.prototype.onUpload = function(file) {
    this.MatrixOfflineF.validateType(file.type);
    return this.MatrixOfflineF.parseFile(file, this.matrix, this.bromeliads).then((function(_this) {
      return function(measurements) {
        return _this.$q.all([_this.$q.when(measurements), _this.DialogF.successDialog("Matrix has been replaced by the uploaded matrix. <br>To apply these changes to the database, <br>click <b>Finish Editing</b>")]);
      };
    })(this)).then((function(_this) {
      return function(arg) {
        var measurements;
        measurements = arg[0];
        return _this.$scope.confirm(measurements);
      };
    })(this));
  };

  MatrixOfflineC.prototype.getFile = function() {
    return this.MatrixOfflineF.generateFile(this.matrix, this.bromeliads);
  };

  return MatrixOfflineC;

})();

app.controller('MatrixOfflineC', MatrixOfflineC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('MatrixOfflineF', function(FileParserF) {
  var MatrixOfflineF;
  MatrixOfflineF = {};
  MatrixOfflineF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel'];
  MatrixOfflineF.validateType = function(type) {
    if (indexOf.call(MatrixOfflineF.SUPPORTED_TYPES, type) < 0) {
      throw new Error("File type not supported. Please select a CSV or TSV file.");
    }
  };
  MatrixOfflineF.generateFile = function(matrix, bromeliads) {
    var obj;
    obj = MatrixOfflineF.fileObject(matrix, bromeliads);
    return Papa.unparse(obj);
  };
  MatrixOfflineF.fileObject = function(matrix, bromeliads) {
    var bromeliad_id, bwg_name, max, measurement, measurement_id, min, ref, ref1, ref2, row, rows, species, species_id, unit, value;
    rows = [];
    ref = matrix.species;
    for (species_id in ref) {
      species = ref[species_id];
      bwg_name = species.bwg_name;
      ref1 = species.measurements;
      for (measurement_id in ref1) {
        measurement = ref1[measurement_id];
        row = {};
        row['BWG code'] = bwg_name;
        row['Category/Range'] = measurement.category_range;
        row['ID'] = measurement_id;
        if (measurement.category_range === 'category') {
          row['Measurement'] = measurement.measurement.value;
        } else {
          min = measurement.measurement.min;
          max = measurement.measurement.max;
          unit = measurement.measurement.unit;
          row['Measurement'] = min + " - " + max + " " + unit;
        }
        ref2 = measurement.bromeliads;
        for (bromeliad_id in ref2) {
          value = ref2[bromeliad_id];
          row[bromeliads[bromeliad_id]] = value;
        }
        rows.push(row);
      }
    }
    return rows;
  };
  MatrixOfflineF.parseFile = function(file, matrix, bromeliads) {
    var options;
    options = {
      header: true,
      skipEmptyLines: true
    };
    return FileParserF.parse(file, options).then(function(data) {
      var bromeliad_id, bwg_name, i, k, len, m, measurement_id, measurements, row, species, v;
      MatrixOfflineF.validateFile(data, matrix, bromeliads);
      measurements = {};
      for (i = 0, len = data.length; i < len; i++) {
        row = data[i];
        bwg_name = row['BWG code'];
        species = MatrixOfflineF.findSpecies(bwg_name, matrix);
        measurement_id = row['ID'];
        m = MatrixOfflineF.findMeasurement(species, measurement_id);
        measurements[measurement_id] = {};
        for (k in row) {
          v = row[k];
          if (!(k !== 'BWG code' && k !== 'Category/Range' && k !== 'ID' && k !== 'Measurement')) {
            continue;
          }
          bromeliad_id = MatrixOfflineF.findBromeliadId(k, bromeliads);
          measurements[measurement_id][bromeliad_id] = v;
        }
      }
      return measurements;
    });
  };
  MatrixOfflineF.validateFile = function(data, matrix, bromeliads) {
    var bromeliadsCount, bwg_name, i, k, len, measurementCount, measurement_id, row, species, v;
    measurementCount = 0;
    for (i = 0, len = data.length; i < len; i++) {
      row = data[i];
      bwg_name = row['BWG code'];
      measurement_id = row['ID'];
      species = MatrixOfflineF.findSpecies(bwg_name, matrix);
      MatrixOfflineF.findMeasurement(species, measurement_id);
      measurementCount++;
      bromeliadsCount = 0;
      for (k in row) {
        v = row[k];
        if (!(k !== 'BWG code' && k !== 'Category/Range' && k !== 'ID' && k !== 'Measurement')) {
          continue;
        }
        MatrixOfflineF.findBromeliadId(k, bromeliads);
        bromeliadsCount++;
      }
      if (bromeliadsCount !== Object.keys(bromeliads).length) {
        throw new Error("Uploaded matrix is missing some bromeliads columns");
      }
    }
    if (measurementCount !== MatrixOfflineF.countMeasurements(matrix)) {
      throw new Error("Uploaded matrix is missing some measurements rows");
    }
  };
  MatrixOfflineF.countMeasurements = function(matrix) {
    var count, measurement, ref, ref1, species, species_id, type;
    count = 0;
    ref = matrix.species;
    for (species_id in ref) {
      species = ref[species_id];
      ref1 = species.measurements;
      for (type in ref1) {
        measurement = ref1[type];
        count++;
      }
    }
    return count;
  };
  MatrixOfflineF.findSpecies = function(bwg_name, matrix) {
    var ref, species, species_id;
    ref = matrix.species;
    for (species_id in ref) {
      species = ref[species_id];
      if (species.bwg_name === bwg_name) {
        return species;
      }
    }
    throw new Error("Species '" + bwg_name + "' not found in original matrix");
  };
  MatrixOfflineF.findBromeliadId = function(original_id, bromeliads) {
    var k, v;
    for (k in bromeliads) {
      v = bromeliads[k];
      if (v === original_id) {
        return k;
      }
    }
    throw new Error("Bromeliad '" + original_id + "' not found in original matrix");
  };
  MatrixOfflineF.findMeasurement = function(species, measurement_id) {
    var bwg_name;
    bwg_name = species.bwg_name;
    if (species.measurements[measurement_id] == null) {
      throw new Error("Species <b>" + bwg_name + "</b> does not have the measurement " + measurement + " (ID: " + measurement_id + ") in original matrix");
    }
    return species.measurements[measurement_id];
  };
  return MatrixOfflineF;
});

var BiomassC;

BiomassC = (function() {
  function BiomassC($scope, tag, ValidatorF) {
    $scope.biomass = tag.biomass || "";
    $scope.tag = tag;
    $scope.submit = function(biomass) {
      ValidatorF.validateNumber('Biomass', biomass);
      return $scope.confirm(biomass);
    };
  }

  return BiomassC;

})();

app.controller('BiomassC', BiomassC);

var MeasurementEditC;

MeasurementEditC = (function() {
  function MeasurementEditC(category, measurement, MeasurementF, DialogF, $scope) {
    this.category = category;
    if (measurement != null ? measurement.add : void 0) {
      this.add = true;
      this.data = {
        biomass: {
          unit: 'mg',
          dry_wet: 'dry'
        }
      };
      this.dataset_id = measurement.dataset_id;
      this.species_id = measurement.species_id;
    } else {
      this.data = measurement;
      if (!this.data.biomass) {
        this.data.biomass = {
          unit: 'mg',
          dry_wet: 'dry'
        };
      }
      this.add = false;
    }
    this.MeasurementF = MeasurementF;
    this.DialogF = DialogF;
    this.$scope = $scope;
  }

  MeasurementEditC.prototype.submit = function() {
    var addObj, editObj, speciesObj;
    if (this.add) {
      addObj = this.formatAddObj(this.data);
      speciesObj = {};
      speciesObj[this.species_id] = addObj;
      return this.MeasurementF.createMeasurements(this.dataset_id, speciesObj).then((function(_this) {
        return function() {
          return _this.$scope.confirm();
        };
      })(this));
    } else {
      editObj = this.formatEditObj(this.data);
      console.log(editObj);
      return this.MeasurementF.editMeasurement(this.data.measurement_id, editObj).then((function(_this) {
        return function() {
          return _this.$scope.confirm();
        };
      })(this));
    }
  };

  MeasurementEditC.prototype.formatAddObj = function(data) {
    var mObj, obj, ref;
    obj = {};
    mObj = {};
    if (this.category) {
      mObj = {
        value: data.value
      };
    } else {
      mObj = {
        min: data.min,
        max: data.max,
        unit: data.unit
      };
    }
    if (data.biomass && ((ref = data.biomass.value) != null ? ref.length : void 0) > 0 && data.biomass.value !== 'NA') {
      mObj.biomass = data.biomass;
    }
    if (this.category) {
      obj.categories = [mObj];
    } else {
      obj.ranges = [mObj];
    }
    return obj;
  };

  MeasurementEditC.prototype.formatEditObj = function(data) {
    var obj, ref;
    obj = {};
    if (this.category) {
      obj.value = data.value;
    } else {
      obj = {
        min: data.min,
        max: data.max,
        unit: data.unit
      };
    }
    if (data.biomass && ((ref = data.biomass.value) != null ? ref.length : void 0) > 0 && data.biomass.value !== 'NA') {
      obj.biomass = data.biomass;
    }
    return obj;
  };

  return MeasurementEditC;

})();

app.controller('MeasurementEditC', MeasurementEditC);

app.factory('MeasurementF', function(ApiF, $q) {
  var MeasurementF;
  MeasurementF = {};
  MeasurementF.getMeasurements = function(dataset_id) {
    return ApiF.get('measurements', 'list', {
      params: {
        dataset_id: dataset_id
      }
    });
  };
  MeasurementF.createMeasurements = function(dataset_id, measurements) {
    var data;
    data = {
      dataset_id: dataset_id,
      species: measurements
    };
    return ApiF.post('measurements', 'new', null, {
      measurements: [data]
    });
  };
  MeasurementF.editMeasurement = function(measurement_id, measurement) {
    var data;
    data = {};
    data[measurement_id] = measurement;
    return ApiF.post('measurements', 'edit', null, {
      measurements: data
    });
  };
  MeasurementF.removeMeasurementById = function(measurement_id) {
    return ApiF.post('measurements', 'deleteID', null, {
      measurements: [measurement_id]
    });
  };
  MeasurementF.removeMeasurements = function(dataset_id, species_id) {
    var data;
    data = {
      dataset_id: dataset_id
    };
    if (species_id != null) {
      data.species = [species_id];
    } else {
      data.species = 'all';
    }
    return ApiF.post('measurements', 'delete', null, {
      measurements: [data]
    });
  };
  return MeasurementF;
});

var MeasurementNewC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

MeasurementNewC = (function() {
  function MeasurementNewC(MeasurementF, SpeciesF, $uibModal, ngDialog, dataset_id, DatasetF, $uibModalInstance, existingSpecies) {
    this.MeasurementF = MeasurementF;
    this.SpeciesF = SpeciesF;
    this.$uibModal = $uibModal;
    this.species = [];
    this.existingSpecies = existingSpecies;
    this.ngDialog = ngDialog;
    this.dataset_id = dataset_id;
    this.$uibModalInstance = $uibModalInstance;
  }

  MeasurementNewC.prototype.speciesAutoComplete = function(bwg_name) {
    return this.SpeciesF.loadSpeciesAutoComplete(bwg_name);
  };

  MeasurementNewC.prototype.onSpeciesSelect = function(item) {
    this.k = "";
    return this.addSpecies(item);
  };

  MeasurementNewC.prototype.speciesSelector = function() {
    var modal;
    modal = this.$uibModal.open({
      templateUrl: 'species/selector.html',
      controller: 'SpeciesSelectorC',
      controllerAs: 'species',
      size: 'lg'
    });
    return modal.result.then((function(_this) {
      return function(species) {
        return _this.addSpecies(species);
      };
    })(this));
  };

  MeasurementNewC.prototype.addSpecies = function(species) {
    var i, len, newSpecies, ref, ref1, s;
    if (ref = species.species_id, indexOf.call(this.existingSpecies, ref) >= 0) {
      throw new Error("Species was added to the dataset, please select another species");
    }
    ref1 = this.species;
    for (i = 0, len = ref1.length; i < len; i++) {
      s = ref1[i];
      if (species.species_id === s.species_id) {
        throw new Error("Species already added, please select another species");
      }
    }
    newSpecies = angular.copy(species);
    this.species.push(newSpecies);
    if (!newSpecies.names) {
      return this.SpeciesF.loadSpeciesById(newSpecies.species_id).then((function(_this) {
        return function(s) {
          return newSpecies.names = s.names;
        };
      })(this));
    }
  };

  MeasurementNewC.prototype.removeSpecies = function(species) {
    var s;
    return this.species = (function() {
      var i, len, ref, results;
      ref = this.species;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (species.species_id !== s.species_id) {
          results.push(s);
        }
      }
      return results;
    }).call(this);
  };

  MeasurementNewC.prototype.submit = function() {
    return this.$uibModalInstance.close(this.species);
  };

  MeasurementNewC.prototype.parse412Error = function(message) {
    var _findSpecies, species, species_id, str;
    _findSpecies = (function(_this) {
      return function(species_id) {
        var i, len, ref, species;
        ref = _this.species;
        for (i = 0, len = ref.length; i < len; i++) {
          species = ref[i];
          if (species.species_id === species_id) {
            return species;
          }
        }
      };
    })(this);
    str = message.match(/species_id:\ \d*/g);
    if (str && str.length > 0) {
      species_id = str[0].substring(12);
      species = _findSpecies(species_id);
      throw new Error("Species <b>" + species.bwg_name + "</b> already in measurements list");
    } else {
      throw new Error(message);
    }
  };

  MeasurementNewC.prototype.createMeasurements = function(measurements) {
    return this.MeasurementF.createMeasurements(this.dataset_id, measurements);
  };

  MeasurementNewC.prototype.editMeasurements = function(measurements) {
    return this.MeasurementF.editMeasurements(this.dataset_id, measurements);
  };

  return MeasurementNewC;

})();

app.controller('MeasurementNewC', MeasurementNewC);

var SpeciesC;

SpeciesC = (function() {
  SpeciesC.prototype.CONFIRM_COUNT = 200;

  SpeciesC.prototype.selected = [];

  SpeciesC.prototype.showDrawer = null;

  SpeciesC.prototype.controls = {
    species: [],
    view: 'classification',
    dataset_id: null,
    search: null,
    loading: true,
    tableInfo: {
      total: 0,
      page: 1,
      count: 20
    }
  };

  function SpeciesC(SpeciesF, SpeciesTableF, DatasetF, ngDialog, LocalStorageF, $scope, $state, $stateParams) {
    var dataset_id;
    this.SpeciesTableF = SpeciesTableF;
    this.ngDialog = ngDialog;
    this.SpeciesF = SpeciesF;
    this.LocalStorageF = LocalStorageF;
    this.$state = $state;
    this.dataset = null;
    this.watchState($scope);
    if (dataset_id = $stateParams.dataset_id != null) {
      this.controls.dataset_id = $stateParams.dataset_id;
      DatasetF.getDataset(this.controls.dataset_id).then((function(_this) {
        return function(dataset) {
          return _this.dataset = dataset;
        };
      })(this));
    } else {
      this.controls.dataset_id = null;
      this.syncState();
    }
    this.tableParams = SpeciesTableF.tableParams(this.controls);
    if (this.isClassification()) {
      this.showClassification();
    }
    if (this.isTraits()) {
      this.showTraits();
    } else if (this.isTachet()) {
      this.showTachet();
    }
  }

  SpeciesC.prototype.setCount = function(count) {
    var _setCount;
    _setCount = (function(_this) {
      return function(count) {
        _this.tableParams.count(count);
        _this.controls.tableInfo.count = count;
        return _this.count = "";
      };
    })(this);
    if ((!count) || (count.trim() === "")) {
      throw new Error("Enter a number");
    }
    if (parseInt(count) === 0) {
      throw new Error("Enter a number greater than 0");
    }
    if (isNaN(parseInt(count))) {
      throw new Error("Number entered is invalid");
    }
    count = parseInt(count);
    if (count > this.CONFIRM_COUNT) {
      return this.countConfirm().then(function() {
        return _setCount(count);
      });
    } else {
      return _setCount(count);
    }
  };

  SpeciesC.prototype.getShowing = function() {
    var beginning, count, end, page, total;
    total = this.controls.tableInfo.total;
    page = this.controls.tableInfo.page;
    count = this.controls.tableInfo.count;
    beginning = (page - 1) * count + 1 > 0 ? (page - 1) * count + 1 : 0;
    end = page * count > total ? total : page * count;
    if (end === 0) {
      beginning = 0;
    }
    return "Showing " + beginning + " - " + end + " of " + total;
  };

  SpeciesC.prototype.toggleDrawer = function(drawer) {
    if (drawer === this.showDrawer) {
      return this.showDrawer = null;
    } else {
      return this.showDrawer = drawer;
    }
  };

  SpeciesC.prototype.exportCurrent = function() {
    var csv;
    csv = this.SpeciesF.speciesToCSV(this.controls.species);
    return 'data:text/csv;charset=utf8,' + encodeURIComponent(csv);
  };

  SpeciesC.prototype.search = function(term) {
    if (/[~`!#$%\^&*+=\-\[\]\\';,\/{}|\\":<>\?]/g.test(term)) {
      throw new Error('Search term contains invalid characters');
    }
    if ((!term) || (term.trim === "") || (this.controls.search !== term)) {
      this.controls.search = term || "";
      this.tableParams.page(1);
      return this.tableParams.reload();
    }
  };

  SpeciesC.prototype.clearSearch = function() {
    this.searchTerm = '';
    this.search('');
    return this.showDrawer = null;
  };

  SpeciesC.prototype.isClassification = function() {
    return this.controls.view === 'classification';
  };

  SpeciesC.prototype.isTraits = function() {
    return this.controls.view === 'traits';
  };

  SpeciesC.prototype.isTachet = function() {
    return this.controls.view === 'tachet';
  };

  SpeciesC.prototype.showClassification = function() {
    this.controls.view = 'classification';
    return this.tableParams.reload().then((function(_this) {
      return function() {
        return _this.columns = _this.SpeciesTableF.classificationColumns;
      };
    })(this));
  };

  SpeciesC.prototype.showTraits = function() {
    this.controls.view = 'traits';
    return this.tableParams.reload().then((function(_this) {
      return function() {
        return _this.columns = _this.SpeciesTableF.traitsColumns;
      };
    })(this));
  };

  SpeciesC.prototype.showTachet = function() {
    this.controls.view = 'tachet';
    return this.tableParams.reload().then((function(_this) {
      return function() {
        return _this.columns = _this.SpeciesTableF.tachetColumns;
      };
    })(this));
  };

  SpeciesC.prototype.edit = function() {
    if (this.selected.length > 1) {
      throw new Error('More than 1 species selected. Select only 1 to edit.');
    }
    this.$state.go('species-edit', {
      id: this.selected[0]
    });
    return this.selected = [];
  };

  SpeciesC.prototype["delete"] = function() {
    if (this.selected.length === 0) {
      throw new Error("No species selected");
    }
    return this.confirmDelete(this.selected.length).then((function(_this) {
      return function() {
        return _this.SpeciesF.deleteSpecies(_this.selected);
      };
    })(this)).then((function(_this) {
      return function() {
        _this.selected = [];
        return _this.$state.reload();
      };
    })(this));
  };

  SpeciesC.prototype.confirmDelete = function(count) {
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: (function(_this) {
          return function() {
            return count + " species will be delete. Proceed?";
          };
        })(this)
      }
    });
  };

  SpeciesC.prototype.countConfirm = function() {
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: (function(_this) {
          return function() {
            return "Showing more than " + _this.CONFIRM_COUNT + " species may make the page unresponsive. Do you wish to continue?";
          };
        })(this)
      }
    });
  };

  SpeciesC.prototype.upload = function() {
    return this.ngDialog.openConfirm({
      template: 'species/upload.html',
      controller: 'SpeciesUploadC',
      controllerAs: 'species'
    }).then((function(_this) {
      return function() {
        return _this.tableParams.reload();
      };
    })(this));
  };

  SpeciesC.prototype["export"] = function() {
    return this.ngDialog.openConfirm({
      template: 'species/export.html',
      controller: 'SpeciesExportC',
      controllerAs: 'species',
      resolve: {
        species: (function(_this) {
          return function() {
            return _this.controls.species;
          };
        })(this),
        selected: (function(_this) {
          return function() {
            return _this.selected;
          };
        })(this)
      }
    });
  };

  SpeciesC.prototype.syncState = function() {
    var state, tableInfo;
    if (state = this.LocalStorageF.speciesState.get()) {
      if (state.search) {
        this.controls.search = state.search;
      }
      if (tableInfo = state.tableInfo) {
        if (tableInfo.page != null) {
          this.controls.tableInfo.page = tableInfo.page;
        }
        if ((tableInfo.count != null) && tableInfo.count < 100) {
          this.controls.tableInfo.count = tableInfo.count;
        }
      }
      if (state.view != null) {
        return this.controls.view = state.view;
      }
    }
  };

  SpeciesC.prototype.watchState = function($scope) {
    $scope.$watch(((function(_this) {
      return function() {
        return _this.controls.search;
      };
    })(this)), (function(_this) {
      return function(n, o) {
        var state;
        _this.selected = [];
        state = _this.LocalStorageF.speciesState.get() || {};
        state.search = n;
        return _this.LocalStorageF.speciesState.set(state);
      };
    })(this), true);
    $scope.$watch(((function(_this) {
      return function() {
        return _this.controls.tableInfo;
      };
    })(this)), (function(_this) {
      return function(n, o) {
        var state;
        _this.selected = [];
        state = _this.LocalStorageF.speciesState.get() || {};
        state.tableInfo = n;
        return _this.LocalStorageF.speciesState.set(state);
      };
    })(this), true);
    return $scope.$watch(((function(_this) {
      return function() {
        return _this.controls.view;
      };
    })(this)), (function(_this) {
      return function(n, o) {
        var state;
        state = _this.LocalStorageF.speciesState.get() || {};
        state.view = n;
        return _this.LocalStorageF.speciesState.set(state);
      };
    })(this), true);
  };

  return SpeciesC;

})();

app.controller('SpeciesC', SpeciesC);

var SpeciesEditC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SpeciesEditC = (function() {
  function SpeciesEditC(SpeciesTableF, SpeciesF, ngDialog, edit, $q, $state, $window, $rootScope, $anchorScroll, $location) {
    this.SpeciesF = SpeciesF;
    this.species = {};
    this.data = {};
    this.names = [];
    this.traits = [];
    this.tachet = {};
    this.newTrait = {
      type: '',
      value: ''
    };
    this.editing = {};
    this.classificationColumns = this.SpeciesF.classificationColumns;
    this.ngDialog = ngDialog;
    this.$state = $state;
    this.$q = $q;
    this.$window = $window;
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.getTachetTraits().then((function(_this) {
      return function() {
        if (edit != null) {
          _this.edit = edit;
          return _this.loadSpecies(edit).then(function(species) {
            _this.species = species;
            return _this.populateSpecies(species);
          });
        }
      };
    })(this));
  }

  SpeciesEditC.prototype.getTachetTraits = function() {
    return this.SpeciesF.loadTachetTraits().then((function(_this) {
      return function(results) {
        return _this.tachetList = results.traits;
      };
    })(this));
  };

  SpeciesEditC.prototype.successDialog = function() {
    var action;
    action = this.edit ? 'edited' : 'created';
    return this.ngDialog.openConfirm({
      template: 'successDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: function() {
          return "Species " + action + " successfully";
        }
      }
    });
  };

  SpeciesEditC.prototype.resetDialog = function() {
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: function() {
          return "All your changes will be reset. Proceed?";
        }
      }
    });
  };

  SpeciesEditC.prototype.back = function() {
    return this.$window.history.back();
  };

  SpeciesEditC.prototype.addTrait = function(type, value) {
    var i, len, ref, trait;
    ref = this.traits;
    for (i = 0, len = ref.length; i < len; i++) {
      trait = ref[i];
      if (trait.type === type) {
        throw new Error("Trait " + type + " already exists");
      }
    }
    this.traits.push({
      type: type,
      value: value
    });
    return this.newTrait = {
      type: '',
      value: ''
    };
  };

  SpeciesEditC.prototype.newTraitEntry = function() {
    this.traits.push({
      type: '',
      value: ''
    });
    this.$location.hash('new');
    return this.$anchorScroll();
  };

  SpeciesEditC.prototype.removeTrait = function(index) {
    return this.traits.splice(index, 1);
  };

  SpeciesEditC.prototype.resetTraits = function() {
    return this.populateTraits(this.species.traits);
  };

  SpeciesEditC.prototype.resetNames = function() {
    return this.populateNames(this.species.names);
  };

  SpeciesEditC.prototype.traitSuggestions = function(type) {
    return this.SpeciesF.loadTraitSuggestions(type);
  };

  SpeciesEditC.prototype.reset = function() {
    return this.resetDialog().then((function(_this) {
      return function() {
        return _this.populateSpecies(_this.species);
      };
    })(this));
  };

  SpeciesEditC.prototype.resetField = function(field) {
    var ref;
    if (this.edit && this.species[field]) {
      this.data[field].value = this.species[field];
      return this.editing[field] = false;
    } else {
      if ((ref = this.data[field]) != null ? ref.value : void 0) {
        return this.data[field].value = "";
      }
    }
  };

  SpeciesEditC.prototype.submit = function() {
    var i, j, k, len, len1, nameObj, ref, ref1, ref2, species, species_id, trait, v;
    species = {};
    ref = this.data;
    for (k in ref) {
      v = ref[k];
      if (v) {
        species[k] = v.value;
      }
    }
    species.names = [];
    ref1 = this.names;
    for (i = 0, len = ref1.length; i < len; i++) {
      nameObj = ref1[i];
      species.names.push(nameObj.text);
    }
    species.traits = {};
    ref2 = this.traits;
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      trait = ref2[j];
      if (trait.type && trait.type.length > 0) {
        species.traits[trait.type] = trait.value;
      }
    }
    species.tachet = angular.copy(this.tachet);
    this.SpeciesF.validateTraits(species.traits);
    if (this.edit != null) {
      species_id = this.edit;
      return this.editSpecies(species).then((function(_this) {
        return function() {
          _this.successDialog().then(function() {
            return _this.$state.reload();
          });
        };
      })(this));
    } else {
      return this.insertSpecies(species).then((function(_this) {
        return function(species_id) {
          _this.successDialog().then(function() {
            return _this.$state.go('species-edit', {
              id: species_id
            });
          });
        };
      })(this));
    }
  };

  SpeciesEditC.prototype.editSpecies = function(species) {
    return this.SpeciesF.editSpecies(this.edit, species);
  };

  SpeciesEditC.prototype.insertSpecies = function(species) {
    return this.SpeciesF.createSpecies(species).then((function(_this) {
      return function(arg) {
        var duplicates, inserted;
        inserted = arg[0], duplicates = arg[1];
        return inserted[0];
      };
    })(this));
  };

  SpeciesEditC.prototype.isEdited = function(field) {
    var formValue, ref, ref1, ref2;
    if (this.edit == null) {
      return false;
    }
    formValue = (ref = this.data) != null ? (ref1 = ref[field]) != null ? ref1.value : void 0 : void 0;
    if (formValue === '') {
      formValue = 'NA';
    }
    return (((ref2 = this.species) != null ? ref2[field] : void 0) || 'NA') !== formValue;
  };

  SpeciesEditC.prototype.doneEdit = function(field, $event) {
    var _nextField, nextField;
    _nextField = (function(_this) {
      return function(field) {
        var column, found, i, len, ref;
        found = false;
        ref = _this.classificationColumns;
        for (i = 0, len = ref.length; i < len; i++) {
          column = ref[i];
          if (found) {
            return column.field;
          } else {
            if (column.field === field) {
              found = true;
            }
          }
        }
        return null;
      };
    })(this);
    if ($event.keyCode === 13) {
      this.editing[field] = false;
      nextField = _nextField(field);
      if (nextField) {
        return this.editing[nextField] = true;
      }
    }
  };

  SpeciesEditC.prototype.checkBWGname = function(bwg_name) {
    if (!bwg_name || bwg_name.trim().length === 0) {
      return this.data.bwg_name = {
        error: "required"
      };
    }
    if ((this.edit != null) && bwg_name === this.species.bwg_name) {
      return this.data.bwg_name.error = null;
    }
    return this.SpeciesF.checkBWGname(bwg_name).then((function(_this) {
      return function(available) {
        if (available) {
          _this.data.bwg_name.error = null;
          return _this.data.bwg_name.checked = true;
        } else {
          return _this.data.bwg_name.error = _this.SpeciesF.BWG_NAME_TAKEN;
        }
      };
    })(this));
  };

  SpeciesEditC.prototype.loadSpecies = function(species_id) {
    return this.SpeciesF.loadSpeciesById(species_id);
  };

  SpeciesEditC.prototype.populateSpecies = function(species) {
    var c, fields, k, v;
    this.data = {};
    fields = (function() {
      var i, len, ref, results1;
      ref = this.SpeciesF.classificationColumns;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results1.push(c.field);
      }
      return results1;
    }).call(this);
    for (k in species) {
      v = species[k];
      if (k !== 'traits' && k !== 'names') {
        if (indexOf.call(fields, k) >= 0) {
          this.data[k] = {
            value: v,
            error: null
          };
        }
      }
    }
    this.populateNames(species.names);
    this.populateTraits(species.traits);
    return this.populateTachet(species.tachet);
  };

  SpeciesEditC.prototype.populateTraits = function(traits) {
    var results1, type, value;
    this.traits = [];
    if (traits) {
      results1 = [];
      for (type in traits) {
        value = traits[type];
        results1.push(this.traits.push({
          type: type,
          value: value
        }));
      }
      return results1;
    }
  };

  SpeciesEditC.prototype.populateTachet = function(tachet) {
    return this.tachet = tachet;
  };

  SpeciesEditC.prototype.populateNames = function(names) {
    var i, len, name, results1;
    this.names = [];
    if (names) {
      results1 = [];
      for (i = 0, len = names.length; i < len; i++) {
        name = names[i];
        results1.push(this.names.push({
          text: name
        }));
      }
      return results1;
    }
  };

  SpeciesEditC.prototype.getTraitWidth = function(trait) {
    if (!(trait && trait.length > 0)) {
      return {
        width: '60px'
      };
    }
    return {
      width: (trait.length + 1) * 7 + 'px'
    };
  };

  SpeciesEditC.prototype.showSuggestor = function(bwg_name) {
    return this.SpeciesF.speciesSuggestor(bwg_name).then((function(_this) {
      return function(suggestion) {
        return _this.data.bwg_name = {
          value: suggestion
        };
      };
    })(this));
  };

  return SpeciesEditC;

})();

app.controller('SpeciesEditC', SpeciesEditC);

var SpeciesExportC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SpeciesExportC = (function() {
  SpeciesExportC.prototype.FILE_MAP = {
    csv: "CSV",
    tsv: "TSV",
    json: "JSON"
  };

  SpeciesExportC.prototype.CONTENT_MAP = {
    all: "Entire Database",
    display: "Currently Displayed",
    selections: "Selections"
  };

  function SpeciesExportC(SpeciesExportF, species, selected, $scope) {
    this.SpeciesExportF = SpeciesExportF;
    this.species = species;
    this.selected = selected;
    this.$scope = $scope;
    this.setFileType('csv');
    this.exportContent = this.selected.length > 0 ? 'selections' : 'display';
  }

  SpeciesExportC.prototype.setFileType = function(type) {
    this.stage = 0;
    return this.fileType = type;
  };

  SpeciesExportC.prototype.setContent = function(content) {
    this.stage = 0;
    return this.exportContent = content;
  };

  SpeciesExportC.prototype["export"] = function() {
    var component, data, s, text;
    this.stage = 1;
    if (this.exportContent === 'selections') {
      data = (function() {
        var i, len, ref, ref1, results;
        ref = this.species;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          s = ref[i];
          if (ref1 = s.species_id, indexOf.call(this.selected, ref1) >= 0) {
            results.push(s);
          }
        }
        return results;
      }).call(this);
    } else if (this.exportContent === 'display') {
      data = this.species;
    } else {

    }
    if (data.length === 0) {
      this.stage = 0;
      throw new Error("No species to export");
      return;
    }
    text = this.SpeciesExportF.unparseSpecies(data, this.fileType);
    component = encodeURIComponent(text);
    if (this.fileType === 'csv') {
      this.fileName = 'species-export.csv';
      this.link = 'data:text/csv;charset=utf-8,' + component;
    } else if (this.fileType === 'tsv') {
      this.fileName = 'species-export.txt';
      this.link = 'data:text/tab-separated-values;charset=utf-8,' + component;
    } else {
      this.fileName = 'species-export.json';
      this.link = 'data:application/json;charset=utf-8,' + component;
    }
    setTimeout((function(_this) {
      return function() {
        _this.stage = 2;
        return _this.$scope.$apply(function() {
          return _this.stage = 2;
        });
      };
    })(this), 1000);
  };

  return SpeciesExportC;

})();

app.controller('SpeciesExportC', SpeciesExportC);

app.factory('SpeciesExportF', function() {
  var SpeciesExportF, _flattenTraitsNames;
  SpeciesExportF = {};
  SpeciesExportF.unparseSpecies = function(species, type) {
    var j, l, len, len1, obj, options, ref, s, trait, traits, value;
    traits = {};
    for (j = 0, len = species.length; j < len; j++) {
      s = species[j];
      console.log(s.traits);
      if (s.traits && Object.keys(s.traits).length > 0) {
        ref = s.traits;
        for (trait in ref) {
          value = ref[trait];
          traits[trait] = true;
        }
      }
    }
    if (type === 'csv' || type === 'tsv') {
      obj = [];
      for (l = 0, len1 = species.length; l < len1; l++) {
        s = species[l];
        obj.push(_flattenTraitsNames(s, traits));
      }
      if (type === 'csv') {
        options = {
          delimiter: ','
        };
      } else {
        options = {
          delimiter: '\t'
        };
      }
      return Papa.unparse(obj, options);
    } else {
      return JSON.stringify(species, null, '\t');
    }
  };
  _flattenTraitsNames = function(species, traits) {
    var i, j, k, len, name, obj, type, v;
    obj = {};
    for (k in species) {
      v = species[k];
      if (k === 'names') {
        i = 0;
        for (j = 0, len = v.length; j < len; j++) {
          name = v[j];
          obj["name" + i] = name;
          i++;
        }
      } else if (k === 'traits') {
        for (type in traits) {
          if (v[type] != null) {
            obj[type] = v[type];
          } else {
            obj[type] = 'NA';
          }
        }
      } else {
        obj[k] = v;
      }
    }
    return obj;
  };
  return SpeciesExportF;
});

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('SpeciesF', function(ConstantsF, ApiF, $http, $q, $uibModal, ngDialog) {
  var SpeciesF;
  SpeciesF = {};
  SpeciesF.BWG_NAME_TAKEN = "BWG code taken";
  SpeciesF.AUTO_COMPLETE_LIMIT = 15;
  SpeciesF.showSpecies = function(species_id) {
    console.log(species_id);
    return $uibModal.open({
      templateUrl: 'species/view.html',
      controller: 'SpeciesViewC',
      controllerAs: 'species',
      resolve: {
        species_id: function() {
          return species_id;
        }
      }
    });
  };
  SpeciesF.loadSpecies = function(params) {
    var options;
    options = {};
    if (params) {
      options.params = params;
    }
    return ApiF.get('species', 'list', options).then(function(results) {
      return [results.species, results.total, results.traits, results.tachet];
    });
  };
  SpeciesF.getDataset = function(species_id) {
    return ApiF.get('species', 'dataset', {
      params: {
        species_ids: species_id
      }
    }).then(function(results) {
      if (results[species_id]) {
        return results[species_id];
      } else {
        return [];
      }
    });
  };
  SpeciesF.loadSpeciesById = function(species_id) {
    var options;
    options = {
      params: {
        species_id: species_id,
        traits: true,
        tachet: true
      }
    };
    return ApiF.get('species', 'list', options).then(function(results) {
      var ref;
      if ((results != null ? (ref = results.species) != null ? ref.length : void 0 : void 0) > 0) {
        return results.species[0];
      } else {
        throw new Error("Species (species_id: " + species_id + ") not found");
        return $q.reject();
      }
    });
  };
  SpeciesF.loadTraitSuggestions = function(type) {
    var params;
    params = {
      search: type
    };
    return ApiF.get('species', 'traits-list', {
      params: params
    }).then(function(results) {
      return results.types;
    });
  };
  SpeciesF.loadSpeciesAutoComplete = function(search) {
    var params;
    params = {
      bwg_name: search,
      limit: SpeciesF.AUTO_COMPLETE_LIMIT
    };
    return ApiF.get('species', 'auto-complete', {
      params: params
    });
  };
  SpeciesF.loadTachetTraits = function() {
    return ApiF.get('tachet', 'list');
  };
  SpeciesF.createTachetTrait = function(data) {
    return ApiF.postWithLoading('tachet', 'new', null, {
      traits: data
    });
  };
  SpeciesF.updateTachetTraits = function(data) {
    return ApiF.postWithLoading('tachet', 'edit', null, {
      traits: data
    });
  };
  SpeciesF.deleteTrait = function(trait) {
    return ApiF.postWithLoading('tachet', 'delete', null, {
      traits: [trait]
    });
  };
  SpeciesF.createSpecies = function(species) {
    var data, err;
    try {
      SpeciesF.validateSpecies(species);
    } catch (error1) {
      err = error1;
      return $q.reject(err);
    }
    species = SpeciesF.omitEmptyFields(species);
    data = {
      species: [species]
    };
    return ApiF.post('species', 'new', null, data).then(function(results) {
      return [results.inserted, results.duplicates];
    });
  };
  SpeciesF.createSpeciesBatch = function(batch, log_id) {
    var data, i, len, species;
    data = {
      species: []
    };
    for (i = 0, len = batch.length; i < len; i++) {
      species = batch[i];
      data.species.push(SpeciesF.omitEmptyFields(species));
    }
    return ApiF.post('species', 'new', {
      params: {
        log_id: log_id
      }
    }, data).then(function(results) {
      return [results.inserted, results.duplicates];
    });
  };
  SpeciesF.editSpecies = function(species_id, species) {
    var data, error;
    try {
      SpeciesF.validateSpecies(species);
    } catch (error1) {
      error = error1;
      return $q.reject(err);
    }
    SpeciesF.populateNA(species);
    data = {
      species: {}
    };
    data.species[species_id] = species;
    return ApiF.postWithLoading('species', 'edit', null, data);
  };
  SpeciesF.deleteSpecies = function(species) {
    return ApiF.post('species', 'delete', null, {
      species: species
    });
  };
  SpeciesF.checkBWGname = function(bwg_name) {
    var params;
    params = {
      bwg_name: bwg_name
    };
    return ApiF.get('species', 'check-species', {
      params: params
    }).then(function(results) {
      return results.available;
    });
  };
  SpeciesF.speciesToCSV = function(list) {
    return Papa.unparse(angular.toJson(list));
  };
  SpeciesF.validateSpecies = function(species) {
    if (!species.bwg_name || species.bwg_name.length === 0) {
      throw new Error('BWG code is a required field.');
    }
  };
  SpeciesF.validateTraits = function(traits) {
    var c, fields, results1, type, value;
    fields = (function() {
      var i, len, ref, results1;
      ref = SpeciesF.classificationColumns;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results1.push(c.field);
      }
      return results1;
    })();
    results1 = [];
    for (type in traits) {
      value = traits[type];
      if (indexOf.call(fields, type) >= 0) {
        throw new Error("Trait '" + type + "' is a classification field. <br>Please rename the trait.");
      }
      if (type === 'type') {
        throw new Error("Traits cannot have the type 'type'");
      }
      if (type === 'value') {
        throw new Error("Traits cannot have the type 'value'");
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };
  SpeciesF.omitEmptyFields = function(species) {
    return _.omit(species, function(value) {
      return typeof value === 'string' && value.trim() === "";
    });
  };
  SpeciesF.populateNA = function(species) {
    var k, results1, v;
    results1 = [];
    for (k in species) {
      v = species[k];
      if (typeof v === 'string' && v.trim().length === 0) {
        results1.push(species[k] = "NA");
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };
  SpeciesF.speciesSuggestor = function(prefix) {
    return ngDialog.openConfirm({
      templateUrl: 'species/suggestor.html',
      controller: 'SpeciesSuggestorC',
      controllerAs: 'species',
      resolve: {
        prefix: function() {
          if (prefix && prefix.length > 0) {
            return prefix;
          } else {
            return null;
          }
        }
      }
    });
  };
  SpeciesF.getSuggestedBWGName = function(prefix) {
    return ApiF.get('species', 'suggest', {
      params: {
        prefix: prefix
      }
    }).then(function(results) {
      return results.suggestion;
    });
  };
  SpeciesF.classificationColumns = [
    {
      label: "BWG code",
      field: "bwg_name",
      alias: ['bwg_code']
    }, {
      label: "Domain",
      field: "domain"
    }, {
      label: "Kingdom",
      field: "kingdom"
    }, {
      label: "Phylum",
      field: "phylum"
    }, {
      label: "Sub Phylum",
      field: "subphylum"
    }, {
      label: "Class",
      field: "class"
    }, {
      label: "Sub Class",
      field: "subclass"
    }, {
      label: "Order",
      field: "ord",
      alias: ['order']
    }, {
      label: "Sub Order",
      field: "subord",
      alias: ['suborder']
    }, {
      label: "Family",
      field: "family"
    }, {
      label: "Sub Family",
      field: "subfamily"
    }, {
      label: "Tribe",
      field: "tribe"
    }, {
      label: "Genus",
      field: "genus"
    }, {
      label: "Species",
      field: "species"
    }, {
      label: "Sub Species",
      field: "subspecies"
    }, {
      label: "Functional Group",
      field: "functional_group",
      options: ["NA", "gatherer", "scraper", "shredder", "filter.feeder", "piercer", "engulfer"]
    }, {
      label: "Realm",
      field: "realm",
      options: ["NA", "aquatic", "terrestrial"]
    }, {
      label: "Micro/Macro",
      field: "micro_macro",
      options: ["NA", "micro", "macro"]
    }, {
      label: "Predation",
      field: "predation",
      options: ["NA", "predator", "prey"]
    }
  ];
  return SpeciesF;
});

var SpeciesSelectorC;

SpeciesSelectorC = (function() {
  SpeciesSelectorC.prototype.SPECIES_PER_PAGE = 10;

  SpeciesSelectorC.prototype.selected = null;

  function SpeciesSelectorC(SpeciesF, $uibModalInstance) {
    this.SpeciesF = SpeciesF;
    this.showSpecies = SpeciesF.showSpecies;
    this.$uibModalInstance = $uibModalInstance;
    this.classificationColumns = this.SpeciesF.classificationColumns;
    this.page = 1;
    this.loadSpecies(null, this.page);
  }

  SpeciesSelectorC.prototype.loadSpecies = function(search, page) {
    var params;
    params = {
      page: page,
      limit: this.SPECIES_PER_PAGE
    };
    if (search && search.length > 0) {
      params.search = search;
    }
    return this.SpeciesF.loadSpecies(params).then((function(_this) {
      return function(arg) {
        var species, total;
        species = arg[0], total = arg[1];
        _this.data = species;
        _this.total = total;
        return _this.page = page;
      };
    })(this));
  };

  SpeciesSelectorC.prototype.doSearch = function(search) {
    this.search = search;
    return this.loadSpecies(search, 1);
  };

  SpeciesSelectorC.prototype.isSelected = function(species) {
    if (!this.selected) {
      return false;
    }
    return species.species_id === this.selected.species_id;
  };

  SpeciesSelectorC.prototype.setSelected = function(species) {
    var ref;
    if (((ref = this.selected) != null ? ref.species_id : void 0) === species.species_id) {
      return this.selected = null;
    } else {
      return this.selected = species;
    }
  };

  SpeciesSelectorC.prototype.setPage = function() {
    if (this.page === '...') {
      return;
    }
    return this.loadSpecies(this.search, this.page);
  };

  SpeciesSelectorC.prototype.submit = function() {
    if (this.selected == null) {
      throw new Error("No species selected");
    }
    return this.$uibModalInstance.close(this.selected);
  };

  SpeciesSelectorC.prototype.getShowing = function() {
    var beginning, count, end, page, total;
    total = this.total;
    page = this.page;
    count = 10;
    beginning = (page - 1) * count + 1 > 0 ? (page - 1) * count + 1 : 0;
    end = page * count > total ? total : page * count;
    if (end === 0) {
      beginning = 0;
    }
    return "Showing " + beginning + " - " + end + " of " + total;
  };

  return SpeciesSelectorC;

})();

app.controller('SpeciesSelectorC', SpeciesSelectorC);

var SpeciesSuggestorC;

SpeciesSuggestorC = (function() {
  function SpeciesSuggestorC(SpeciesF, prefix) {
    this.SpeciesF = SpeciesF;
    this.prefix = prefix;
  }

  SpeciesSuggestorC.prototype.getSuggestion = function(prefix) {
    var dotPos;
    if (!prefix || prefix.length === 0) {
      throw new Error("Enter a prefix to get suggested BWG code");
    }
    if (!isNaN(parseInt(prefix.slice(-1)))) {
      throw new Error("Prefix must not already end with a number");
    }
    dotPos = prefix.indexOf(".");
    if (dotPos !== -1 && dotPos !== prefix.length - 1) {
      throw new Error("The dot \".\" must be at the end of the prefix");
    }
    this.generating = true;
    return this.SpeciesF.getSuggestedBWGName(prefix).then((function(_this) {
      return function(suggestion) {
        _this.suggestion = angular.copy(prefix) + suggestion;
        return _this.generating = false;
      };
    })(this));
  };

  return SpeciesSuggestorC;

})();

app.controller('SpeciesSuggestorC', SpeciesSuggestorC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.directive('speciesTableD', function(SpeciesF) {
  return {
    restrict: 'EAC',
    templateUrl: 'species/table.html',
    scope: {
      params: '=params',
      columns: '=columns',
      selected: '=selected',
      count: '=count'
    },
    link: function(scope, element, attrs) {
      scope.viewSpecies = function(species_id) {
        return SpeciesF.showSpecies(species_id);
      };
      scope.countArray = function(count) {
        var i, ref, results;
        return (function() {
          results = [];
          for (var i = 0, ref = count - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this);
      };
      scope.sort = function(column) {
        var sortOrder;
        if (!column.sortable) {
          return;
        }
        sortOrder = scope.params.isSortBy(column.field, 'asc') ? 'desc' : 'asc';
        return scope.params.sorting(column.field, sortOrder);
      };
      scope.formatNames = function(names) {
        var i, len, name, nameStr;
        nameStr = "";
        for (i = 0, len = names.length; i < len; i++) {
          name = names[i];
          nameStr += name + "<br>";
        }
        return nameStr;
      };
      scope.naColor = function(value) {
        if (value !== 'NA') {
          return;
        }
        return 'color: #ccc !important';
      };
      scope.select = function(species) {
        if (!species) {
          return;
        }
        if (scope.isSelected(species)) {
          return scope.selected = scope.selected.filter(function(e) {
            return e !== species.species_id;
          });
        } else {
          return scope.selected.push(species.species_id);
        }
      };
      return scope.isSelected = function(species) {
        var ref;
        if (!species) {
          return;
        }
        if (ref = species.species_id, indexOf.call(scope.selected, ref) >= 0) {
          return true;
        }
        return false;
      };
    }
  };
});

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('SpeciesTableF', function(SpeciesF, ngTableParams, $q) {
  var SpeciesTableF;
  SpeciesTableF = {};
  SpeciesTableF.classificationColumns = [
    {
      field: 'species_id',
      visible: false,
      sortable: true,
      title: 'ID'
    }, {
      field: 'bwg_name',
      visible: true,
      primary: true,
      sortable: true,
      title: 'BWG code'
    }, {
      field: 'domain',
      visible: true,
      sortable: true,
      title: 'Domain'
    }, {
      field: 'kingdom',
      visible: true,
      sortable: true,
      title: 'Kingdom'
    }, {
      field: 'phylum',
      visible: true,
      sortable: true,
      title: 'Phylum'
    }, {
      field: 'subphylum',
      visible: true,
      sortable: true,
      title: 'Sub Phylum'
    }, {
      field: 'class',
      visible: true,
      sortable: true,
      title: 'Class'
    }, {
      field: 'subclass',
      visible: true,
      sortable: true,
      title: 'Sub Class'
    }, {
      field: 'ord',
      visible: true,
      sortable: true,
      title: 'Order'
    }, {
      field: 'subord',
      visible: true,
      sortable: true,
      title: 'SubOrder'
    }, {
      field: 'family',
      visible: true,
      sortable: true,
      title: 'Family'
    }, {
      field: 'subfamily',
      visible: true,
      sortable: true,
      title: 'SubFamily'
    }, {
      field: 'tribe',
      visible: true,
      sortable: true,
      title: 'Tribe'
    }, {
      field: 'genus',
      visible: true,
      sortable: true,
      title: 'Genus'
    }, {
      field: 'species',
      visible: true,
      sortable: true,
      title: 'Species'
    }, {
      field: 'subspecies',
      visible: true,
      sortable: true,
      title: 'SubSpecies'
    }, {
      field: 'functional_group',
      visible: true,
      sortable: true,
      title: 'Func. Group'
    }, {
      field: 'realm',
      visible: true,
      sortable: true,
      title: 'Realm'
    }, {
      field: 'predation',
      visible: true,
      sortable: true,
      title: 'Predation'
    }, {
      field: 'micro_macro',
      visible: true,
      sortable: true,
      title: 'Micro/Macro'
    }, {
      field: 'names',
      visible: true,
      sortable: false,
      title: 'Other names'
    }, {
      field: 'barcode',
      visible: true,
      sortable: true,
      title: 'Barcode'
    }
  ];
  SpeciesTableF.traitsColumns = [];
  SpeciesTableF.tachetColumns = [];
  SpeciesTableF.setTraits = function(traits) {
    var i, len, results, trait;
    if (SpeciesTableF._columnsMatch(SpeciesTableF.traitsColumns, traits)) {
      return;
    }
    SpeciesTableF.traitsColumns = [
      {
        field: 'bwg_name',
        visible: true,
        primary: true,
        sortable: true,
        title: 'BWG code'
      }
    ];
    results = [];
    for (i = 0, len = traits.length; i < len; i++) {
      trait = traits[i];
      results.push(SpeciesTableF.traitsColumns.push({
        field: trait,
        visible: true,
        sortable: false,
        title: trait,
        trait: true
      }));
    }
    return results;
  };
  SpeciesTableF.setTachet = function(tachets) {
    var i, len, results, tachet;
    SpeciesTableF.tachetColumns = [
      {
        field: 'bwg_name',
        visible: true,
        primary: true,
        sortable: true,
        title: 'BWG code'
      }
    ];
    results = [];
    for (i = 0, len = tachets.length; i < len; i++) {
      tachet = tachets[i];
      results.push(SpeciesTableF.tachetColumns.push({
        field: tachet.trait,
        visible: true,
        sortable: false,
        title: tachet.trait,
        trait: true,
        tachet: true,
        description: tachet.description
      }));
    }
    return results;
  };
  SpeciesTableF._columnsMatch = function(columns, traits) {
    var column, i, len, ref;
    if ((columns.length - 1) !== traits.length) {
      return false;
    }
    if (columns.length === 0) {
      return false;
    }
    for (i = 0, len = columns.length; i < len; i++) {
      column = columns[i];
      if (column.field !== 'bwg_name') {
        if (ref = column.field, indexOf.call(traits, ref) < 0) {
          return false;
        }
      }
    }
    return true;
  };
  SpeciesTableF.tableParams = function(scope) {
    var ref, ref1;
    return new ngTableParams({
      page: ((ref = scope.tableInfo) != null ? ref.page : void 0) || 1,
      count: ((ref1 = scope.tableInfo) != null ? ref1.count : void 0) || 20,
      sorting: {
        species_id: 'asc'
      },
      counts: [10, 30, 50, 100, 100000]
    }, {
      getData: function($defer, params) {
        var asc, options, orderBy, promise, ref2, ref3;
        scope.loading = true;
        orderBy = (ref2 = params.orderBy()[0]) != null ? ref2.substring(1) : void 0;
        asc = ((ref3 = params.orderBy()[0]) != null ? ref3.substring(0, 1) : void 0) === '+' ? 'true' : 'false';
        options = {
          page: params.page(),
          limit: params.count(),
          orderBy: orderBy,
          asc: asc
        };
        if (scope.search) {
          options.search = scope.search;
        }
        options.traits = scope.view === 'traits';
        options.tachet = scope.view === 'tachet';
        if (scope.dataset_id) {
          options.dataset_id = scope.dataset_id;
        }
        return promise = SpeciesF.loadSpecies(options).then(function(arg) {
          var species, tachet, total, traits;
          species = arg[0], total = arg[1], traits = arg[2], tachet = arg[3];
          if (options.traits) {
            SpeciesTableF.setTraits(traits);
          } else if (options.tachet) {
            SpeciesTableF.setTachet(tachet);
          }
          scope.loading = false;
          scope.species = species;
          scope.tableInfo = {
            total: total,
            page: params.page(),
            count: params.count()
          };
          params.total(total);
          return $defer.resolve(species);
        });
      },
      counts: [10, 30, 50, 100, 100000],
      $loading: false
    });
  };
  return SpeciesTableF;
});

var SpeciesUploadC;

SpeciesUploadC = (function() {
  function SpeciesUploadC(SpeciesF, SpeciesUploadF, DialogF, $scope, HelpF) {
    this.SpeciesF = SpeciesF;
    this.SpeciesUploadF = SpeciesUploadF;
    this.DialogF = DialogF;
    this.$scope = $scope;
    this.HelpF = HelpF;
    this.stage = 0;
  }

  SpeciesUploadC.prototype.onUpload = function(file) {
    if (!file) {
      return;
    }
    this.counter = {
      count: 0,
      duplicates: []
    };
    this.SpeciesUploadF.validateType(file.type);
    this.SpeciesUploadF.validateSize(file.size);
    return this.SpeciesUploadF.validateFile(file).then((function(_this) {
      return function(count) {
        _this.total = count;
        _this.stage = 1;
        return _this.uploadFile(file);
      };
    })(this)).then((function(_this) {
      return function(log_id) {
        _this.stage = 2;
        return _this.insertSpecies(file, _this.counter, log_id);
      };
    })(this));
  };

  SpeciesUploadC.prototype.getProgress = function() {
    if (!this.total) {
      return {};
    }
    return {
      'width': (this.counter.count / this.total * 100) + '%'
    };
  };

  SpeciesUploadC.prototype.insertSpecies = function(file, counter, log_id) {
    return this.SpeciesUploadF.uploadSpecies(file, counter, log_id).then((function(_this) {
      return function() {
        return _this.stage = 3;
      };
    })(this));
  };

  SpeciesUploadC.prototype.uploadFile = function(file) {
    this.progress = 0;
    return this.SpeciesUploadF.uploadFile(file).then((function(_this) {
      return function(file_id) {
        return _this.SpeciesUploadF.createSpeciesLog(file_id);
      };
    })(this));
  };

  SpeciesUploadC.prototype.getProgressClass = function() {
    if (this.counter && this.counter.duplicates && this.counter.duplicates.length > 0) {
      return {
        "progress-bar-warning": true
      };
    } else if (this.stage === 3) {
      return {
        "progress-bar-success": true
      };
    } else {
      return {
        "progress-bar-default": true
      };
    }
  };

  SpeciesUploadC.prototype.getStatusClass = function(stage) {
    if (this.stage === stage) {
      return {
        current: true
      };
    } else if (this.stage > stage) {
      return {
        complete: true
      };
    } else {
      return {
        pending: true
      };
    }
  };

  SpeciesUploadC.prototype.getIconClass = function(stage) {
    var ref, ref1;
    if (this.stage === stage) {
      return {
        'fa-spin': true,
        'fa-circle-o-notch': true
      };
    } else if (stage === 2 && this.stage === 3 && ((ref = this.counter) != null ? (ref1 = ref.duplicates) != null ? ref1.length : void 0 : void 0) > 0) {
      return {
        'fa-times': true,
        'font-red': true
      };
    } else {
      return {
        'fa-check': true
      };
    }
  };

  SpeciesUploadC.prototype.help = function() {
    return this.HelpF.openHelp('species-upload');
  };

  SpeciesUploadC.prototype.cancel = function() {
    if (this.stage > 0) {
      return this.DialogF.confirmDialog("Cancelling upload may cause data corruption. Proceed?").then((function(_this) {
        return function() {
          return _this.$scope.closeThisDialog();
        };
      })(this));
    }
  };

  SpeciesUploadC.prototype.finish = function() {
    return this.$scope.confirm();
  };

  return SpeciesUploadC;

})();

app.controller('SpeciesUploadC', SpeciesUploadC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('SpeciesUploadF', function(SpeciesF, $q, ApiF) {
  var SpeciesUploadF, _isValidTachetValue, isInteger;
  SpeciesUploadF = {};
  SpeciesUploadF.MAX_SIZE_MB = 10;
  SpeciesUploadF.SUPPORTED_TYPES = ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel'];
  SpeciesUploadF.BATCH_SIZE = 20;
  isInteger = function(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  };
  _isValidTachetValue = function(value) {
    if (value === 'NA') {
      return true;
    }
    return Number.isInteger(parseInt(value, 10));
  };
  SpeciesUploadF.getTachetTraits = function() {
    return SpeciesF.loadTachetTraits().then(function(results) {
      var t;
      return (function() {
        var i, len, ref, results1;
        ref = results.traits;
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          t = ref[i];
          results1.push(t.trait);
        }
        return results1;
      })();
    });
  };
  SpeciesUploadF.uploadFile = function(file) {
    var formData, options;
    formData = new FormData();
    formData.append('file', file);
    options = {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': void 0
      }
    };
    return ApiF.post('species', 'upload', options, formData).then(function(results) {
      return results.file_id;
    });
  };
  SpeciesUploadF.createSpeciesLog = function(file_id) {
    return ApiF.get('species', 'log', {
      params: {
        file_id: file_id
      }
    }).then(function(results) {
      return results.log_id;
    });
  };
  SpeciesUploadF.validateType = function(type) {
    if (indexOf.call(SpeciesUploadF.SUPPORTED_TYPES, type) < 0) {
      throw new Error("File type not supported. Please select a CSV or TSV file.");
    }
  };
  SpeciesUploadF.validateSize = function(size) {
    if (size > (SpeciesUploadF.MAX_BYTE_SIZE * 1024 * 1024)) {
      throw new Error("File size exceeded 10MB");
    }
  };
  SpeciesUploadF.validateFile = function(file) {
    return SpeciesUploadF.getTachetTraits().then(function(tachet) {
      return SpeciesUploadF.parseFile(file, function(species, row) {
        return SpeciesUploadF.validateSpecies(species, row, tachet);
      });
    })["catch"](function(err) {
      throw new Error(err);
    });
  };
  SpeciesUploadF.parseFile = function(file, step) {
    var count, deferred;
    deferred = $q.defer();
    count = 0;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      error: function(err, file, inputElem, reason) {
        return deferred.reject("Failed parsing file " + reason);
      },
      step: function(results, parser) {
        var e;
        count++;
        try {
          return step(results.data[0], count);
        } catch (error) {
          e = error;
          deferred.reject(e.message);
          return parser.abort();
        }
      },
      complete: function() {
        if (count === 0) {
          deferred.reject("File is empty");
        }
        return deferred.resolve(count);
      }
    });
    return deferred.promise;
  };
  SpeciesUploadF.uploadSpecies = function(file, counter, log_id) {
    var batchCount, deferred, pending;
    deferred = $q.defer();
    pending = [];
    batchCount = 0;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: function(results, parser) {
        var species;
        species = results.data[0];
        pending.push(species);
        if (pending.length === SpeciesUploadF.BATCH_SIZE) {
          SpeciesUploadF.uploadBatch(angular.copy(pending), log_id).then(function(arg) {
            var duplicateRows, duplicates, inserted, ref, row;
            inserted = arg[0], duplicates = arg[1];
            counter.count += SpeciesUploadF.BATCH_SIZE;
            if (duplicates) {
              duplicateRows = (function() {
                var i, len, results1;
                results1 = [];
                for (i = 0, len = duplicates.length; i < len; i++) {
                  row = duplicates[i];
                  results1.push(row + batchCount * SpeciesUploadF.BATCH_SIZE);
                }
                return results1;
              })();
            } else {
              duplicateRows = [];
            }
            (ref = counter.duplicates).push.apply(ref, duplicateRows);
            batchCount++;
            return parser.resume();
          });
          pending = [];
          return parser.pause();
        }
      },
      complete: function() {
        if (pending.length > 0) {
          return SpeciesUploadF.uploadBatch(angular.copy(pending), log_id).then(function(arg) {
            var duplicateRows, duplicates, inserted, ref, row;
            inserted = arg[0], duplicates = arg[1];
            counter.count += pending.length;
            if (duplicates) {
              duplicateRows = (function() {
                var i, len, results1;
                results1 = [];
                for (i = 0, len = duplicates.length; i < len; i++) {
                  row = duplicates[i];
                  results1.push(row + batchCount * SpeciesUploadF.BATCH_SIZE);
                }
                return results1;
              })();
            } else {
              duplicateRows = [];
            }
            (ref = counter.duplicates).push.apply(ref, duplicateRows);
            deferred.resolve(true);
            return pending = [];
          });
        } else {
          return deferred.resolve(true);
        }
      }
    });
    return deferred.promise;
  };
  SpeciesUploadF.uploadBatch = function(batch, log_id) {
    var data, i, len, obj, species;
    data = [];
    for (i = 0, len = batch.length; i < len; i++) {
      species = batch[i];
      obj = SpeciesUploadF.objectifySpecies(species);
      data.push(obj);
    }
    return SpeciesF.createSpeciesBatch(data, log_id);
  };
  SpeciesUploadF.objectifySpecies = function(species) {
    var column, found, i, k, len, lowerCaseKey, obj, ref, v;
    obj = {};
    for (k in species) {
      v = species[k];
      if ((v != null) && typeof v === 'string') {
        v = v.trim();
      }
      if ((k != null) && typeof k === 'string') {
        k = k.trim();
      }
      lowerCaseKey = k.toLowerCase();
      found = false;
      ref = SpeciesF.classificationColumns;
      for (i = 0, len = ref.length; i < len; i++) {
        column = ref[i];
        if (lowerCaseKey === column.label.toLowerCase() || lowerCaseKey === column.field || (column.alias && column.alias.length > 0 && indexOf.call(column.alias, lowerCaseKey) >= 0)) {
          obj[column.field] = v;
          found = true;
        }
      }
      if (!found) {
        if (k.length > 4 && k.substring(0, 4) === 'name' && isInteger(k.substring(4))) {
          obj.names || (obj.names = []);
          if (!(indexOf.call(obj.names, v) >= 0 || v === 'NA' || v === '')) {
            obj.names.push(v);
          }
        } else if (k.length > 7 && k.substring(0, 7) === 'tachet:') {
          obj.tachet || (obj.tachet = {});
          if (!(v === 'NA' || v === '')) {
            obj.tachet[k.substring(7)] = v;
          }
        } else {
          obj.traits || (obj.traits = {});
          if (!(v === 'NA' || v === '')) {
            obj.traits[k] = v;
          }
        }
      }
    }
    return obj;
  };
  SpeciesUploadF.validateSpecies = function(species, row, tachetList) {
    var column, found, i, k, len, lowerCaseKey, names, ref, ref1, results1, v;
    ref = SpeciesF.classificationColumns;
    for (i = 0, len = ref.length; i < len; i++) {
      column = ref[i];
      found = false;
      for (k in species) {
        v = species[k];
        if ((v != null) && typeof v === 'string') {
          v = v.trim();
        }
        if ((k != null) && typeof k === 'string') {
          k = k.trim();
        }
        lowerCaseKey = k.toLowerCase();
        if (lowerCaseKey === column.label.toLowerCase() || lowerCaseKey === column.field || (column.alias && column.alias.length > 0 && indexOf.call(column.alias, lowerCaseKey) >= 0)) {
          found = true;
          if (column.options != null) {
            if (indexOf.call(column.options, v) < 0) {
              throw new Error("Invalid option for " + column.label + ": " + v + "<br>Available options: " + (column.options.join(', ')));
            }
          }
        }
      }
      if (!found) {
        throw new Error("Missing classification field: " + column.field);
      }
    }
    results1 = [];
    for (k in species) {
      v = species[k];
      if ((v != null) && typeof v === 'string') {
        v = v.trim();
      }
      if ((k != null) && typeof k === 'string') {
        k = k.trim();
      }
      names = [];
      if (k === 'name' || k === 'type' || k === 'value' || k === 'species_id' || k === 'trait' || k === 'tachet') {
        throw new Error("Column '" + k + "' cannot not be used");
      }
      if (k.length > 7 && k.substring(0, 7) === 'tachet:') {
        if (ref1 = k.substring(7), indexOf.call(tachetList, ref1) < 0) {
          throw new Error("Tachet trait '" + (k.substring(7)) + "' does not exist");
        }
        if (!_isValidTachetValue(v)) {
          throw new Error("Tachet trait must have value 'NA' or 0-3");
        }
      }
      if (k.length > 4 && k.substring(0, 4) === 'name' && isInteger(k.substring(4))) {
        if (indexOf.call(names, v) >= 0) {
          throw new Error("Row " + row + ": Duplicate alternate names");
        }
        results1.push(names.push(v));
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };
  return SpeciesUploadF;
});

var SpeciesViewC;

SpeciesViewC = (function() {
  function SpeciesViewC(species_id, SpeciesF, $uibModalInstance) {
    this.SpeciesF = SpeciesF;
    this.$uibModalInstance = $uibModalInstance;
    this.loadSpecies(species_id);
    this.loadDataset(species_id);
    this.loadTachet();
  }

  SpeciesViewC.prototype.loadTachet = function() {
    return this.SpeciesF.loadTachetTraits().then((function(_this) {
      return function(results) {
        var i, len, ref, results1, trait;
        _this.tachets = {};
        ref = results.traits;
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          trait = ref[i];
          results1.push(_this.tachets[trait.trait] = trait.description);
        }
        return results1;
      };
    })(this));
  };

  SpeciesViewC.prototype.loadSpecies = function(species_id) {
    return this.SpeciesF.loadSpeciesById(species_id).then((function(_this) {
      return function(species) {
        return _this.data = species;
      };
    })(this));
  };

  SpeciesViewC.prototype.loadDataset = function(species_id) {
    return this.SpeciesF.getDataset(species_id).then((function(_this) {
      return function(datasets) {
        console.log(datasets);
        return _this.datasets = datasets;
      };
    })(this));
  };

  SpeciesViewC.prototype.dismiss = function() {
    return this.$uibModalInstance.dismiss();
  };

  return SpeciesViewC;

})();

app.controller('SpeciesViewC', SpeciesViewC);

app.factory('AvatarF', function(ApiF, $q) {
  var AvatarF;
  AvatarF = {};
  AvatarF.SUPPORTED_TYPES = ['image/png', 'image/jpeg'];
  AvatarF.getImageSrc = function(file_id) {
    if (!file_id) {
      return $q.when(null);
    }
    return ApiF.get('files', 'info', {
      params: {
        file_id: file_id
      }
    }).then(function(results) {
      var file;
      file = results.file;
      return APP_CONST_PATH + "files/" + file.unique_name;
    });
  };
  AvatarF.getSrcPath = function(filename) {
    if (!(filename && filename.length > 0)) {
      return null;
    }
    return APP_CONST_PATH + "files/" + filename;
  };
  return AvatarF;
});

var RecoverC;

RecoverC = (function() {
  function RecoverC(token, ngDialog, UserF) {
    this.token = token;
    this.ngDialog = ngDialog;
    this.UserF = UserF;
    this.openDialog();
  }

  RecoverC.prototype.openDialog = function() {
    return this.ngDialog.openConfirm({
      template: 'users/set-password.html',
      controller: 'UserPasswordC',
      controllerAs: 'user',
      resolve: {
        onPasswordSet: (function(_this) {
          return function() {
            return function(newPassword) {
              return _this.UserF.resetPassword(_this.token, newPassword);
            };
          };
        })(this)
      }
    });
  };

  return RecoverC;

})();

app.controller('RecoverC', RecoverC);

var UserAvatarC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

UserAvatarC = (function() {
  function UserAvatarC(ApiF, $scope, DialogF, AvatarF) {
    this.ApiF = ApiF;
    this.DialogF = DialogF;
    this.AvatarF = AvatarF;
    this.confirm = $scope.confirm;
  }

  UserAvatarC.prototype.onUpload = function(file) {
    var formData, options, ref;
    if (ref = file.type, indexOf.call(this.AvatarF.SUPPORTED_TYPES, ref) < 0) {
      throw new Error("Only .png or .jpg images are allowed. Sorry no GIFs");
    }
    formData = new FormData();
    formData.append('file', file);
    options = {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': void 0
      }
    };
    return this.ApiF.post('users', 'upload', options, formData).then((function(_this) {
      return function(results) {
        _this.file_id = results.file_id;
        return _this.previewAvatar(results.unique_name);
      };
    })(this));
  };

  UserAvatarC.prototype.previewAvatar = function(unique_name) {
    return this.preview = APP_CONST_PATH + "files/" + unique_name;
  };

  UserAvatarC.prototype.setAvatar = function() {
    if (!this.file_id) {
      return;
    }
    return this.ApiF.post('users', 'avatar', {
      params: {
        file_id: this.file_id
      }
    }, {
      "upload": true
    }).then((function(_this) {
      return function(results) {
        return _this.DialogF.successDialog("Your profile picture has been updated");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.confirm();
      };
    })(this));
  };

  return UserAvatarC;

})();

app.controller('UserAvatarC', UserAvatarC);

var UserEditC;

UserEditC = (function() {
  function UserEditC(AdminF, $scope, DialogF, edit) {
    this.AdminF = AdminF;
    this.$scope = $scope;
    this.DialogF = DialogF;
    if (edit != null) {
      this.edit = true;
      this.data = edit;
      if (edit.role === 'admin') {
        this.data.admin = true;
      } else {
        this.data.admin = false;
      }
    }
  }

  UserEditC.prototype.submit = function(user) {
    var data;
    data = {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.admin ? 'admin' : 'user'
    };
    if ((this.edit == null) || this.setPassword) {
      if (user.password !== user.confirm) {
        throw new Error("Password and confirm password do not match");
      }
      data.password = user.password;
    }
    if (this.edit != null) {
      return this.AdminF.updateUser(data).then((function(_this) {
        return function() {
          return _this.DialogF.successDialog("User successfully updated");
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.$scope.closeThisDialog();
        };
      })(this));
    } else {
      return this.AdminF.createUser(data).then((function(_this) {
        return function() {
          return _this.DialogF.successDialog("User successfully created");
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.$scope.closeThisDialog();
        };
      })(this));
    }
  };

  return UserEditC;

})();

app.controller('UserEditC', UserEditC);

var UserPasswordC;

UserPasswordC = (function() {
  function UserPasswordC(AdminF, $scope, DialogF, onPasswordSet, $state, LocalStorageF, $timeout, $window) {
    this.onPasswordSet = onPasswordSet;
    this.$state = $state;
    this.LocalStorageF = LocalStorageF;
    this.$timeout = $timeout;
    this.$window = $window;
    this.AdminF = AdminF;
    this.$scope = $scope;
    this.DialogF = DialogF;
  }

  UserPasswordC.prototype.submit = function() {
    var p;
    if (!this.password) {
      throw new Error("Enter a password");
    }
    if (!this.confirm) {
      throw new Error("Enter confirm password");
    }
    if (this.password !== this.confirm) {
      throw new Error("Password and confirm password do not match");
    }
    if (this.onPasswordSet != null) {
      p = this.onPasswordSet(this.password);
    } else {
      p = this.AdminF.updatePassword(this.password);
    }
    p.then((function(_this) {
      return function() {
        return _this.DialogF.successDialog("New password successfully set");
      };
    })(this));
    if (this.onPasswordSet != null) {
      return p.then((function(_this) {
        return function() {
          _this.LocalStorageF.token.unset();
          return _this.$timeout(function() {
            return _this.$state.go('dashboard').then(function() {
              return _this.$timeout(function() {
                return _this.$window.location.reload();
              }, 500);
            });
          }, 500);
        };
      })(this));
    } else {
      return p.then((function(_this) {
        return function() {
          return _this.$scope.closeThisDialog();
        };
      })(this));
    }
  };

  return UserPasswordC;

})();

app.controller('UserPasswordC', UserPasswordC);

var VisitC,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

VisitC = (function() {
  VisitC.prototype.sorting = {
    field: null,
    desc: null,
    is: function(field, desc) {
      return (field === this.field) && (desc === this.desc);
    },
    sort: function(field) {
      if (this.field === field) {
        return this.desc = this.desc ? false : true;
      } else {
        this.field = field;
        return this.desc = false;
      }
    }
  };

  function VisitC(VisitF, DatasetF, DialogF, $stateParams, ngDialog, $uibModal, $window) {
    this.VisitF = VisitF;
    this.DialogF = DialogF;
    this.field = VisitF.fields;
    this.ngDialog = ngDialog;
    this.$uibModal = $uibModal;
    this.$window = $window;
    this.dataset_id = $stateParams.dataset_id;
    this.selected = [];
    this.loadVisits();
    DatasetF.getDatasets().then((function(_this) {
      return function(datasets) {
        return _this.datasets = datasets;
      };
    })(this));
    if (this.dataset_id != null) {
      DatasetF.getDataset(this.dataset_id).then((function(_this) {
        return function(dataset) {
          return _this.dataset = dataset;
        };
      })(this));
    }
  }

  VisitC.prototype.loadVisits = function() {
    return this.VisitF.getVisits(this.dataset_id).then((function(_this) {
      return function(visits) {
        return _this.data = visits;
      };
    })(this));
  };

  VisitC.prototype.back = function() {
    return this.$window.history.back();
  };

  VisitC.prototype["new"] = function() {
    var modal;
    modal = this.$uibModal.open({
      templateUrl: 'visit/edit.html',
      controller: 'VisitEditC',
      controllerAs: 'visit',
      keyboard: false,
      backdrop: 'static',
      resolve: {
        dataset_id: (function(_this) {
          return function() {
            return _this.dataset_id;
          };
        })(this),
        edit: function() {
          return null;
        }
      }
    });
    return modal.result.then((function(_this) {
      return function(success) {
        return _this.DialogF.successDialog("Visit successfully created");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadVisits();
      };
    })(this));
  };

  VisitC.prototype.edit = function() {
    var i, len, modal, ref, v, visit;
    if (this.selected.length > 1) {
      throw new Error("Select only one visit to edit");
    }
    ref = this.data;
    for (i = 0, len = ref.length; i < len; i++) {
      v = ref[i];
      if (v.visit_id === this.selected[0]) {
        visit = v;
      }
    }
    modal = this.$uibModal.open({
      templateUrl: 'visit/edit.html',
      controller: 'VisitEditC',
      controllerAs: 'visit',
      keyboard: false,
      backdrop: 'static',
      resolve: {
        edit: (function(_this) {
          return function() {
            return angular.copy(visit);
          };
        })(this),
        dataset_id: null
      }
    });
    return modal.result.then((function(_this) {
      return function(success) {
        return _this.DialogF.successDialog("Visit successfully edited");
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.loadVisits();
      };
    })(this));
  };

  VisitC.prototype["delete"] = function() {
    if (this.selected.length === 0) {
      throw new Error("Select at least 1 visit to delete");
    }
    return this.ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: (function(_this) {
          return function() {
            return _this.selected.length + " visits will be delete. Proceed?";
          };
        })(this)
      }
    }).then((function(_this) {
      return function() {
        return _this.VisitF.deleteVisits(_this.selected);
      };
    })(this)).then((function(_this) {
      return function() {
        return _this.ngDialog.openConfirm({
          template: 'successDialog.html',
          controller: 'ConfirmC',
          resolve: {
            doubleConfirm: function() {
              return null;
            },
            message: function() {
              return "Visits successfully deleted";
            }
          }
        });
      };
    })(this)).then((function(_this) {
      return function() {
        _this.selected = [];
        return _this.loadVisits();
      };
    })(this));
  };

  VisitC.prototype.clearSelected = function() {
    return this.selected = [];
  };

  VisitC.prototype.toggleSelect = function(visit) {
    var ref;
    if (ref = visit.visit_id, indexOf.call(this.selected, ref) >= 0) {
      return this.selected = this.selected.filter(function(e) {
        return e !== visit.visit_id;
      });
    } else {
      return this.selected.push(visit.visit_id);
    }
  };

  VisitC.prototype.isSelected = function(visit) {
    var ref;
    return ref = visit.visit_id, indexOf.call(this.selected, ref) >= 0;
  };

  VisitC.prototype.hasSelected = function() {
    return this.selected.length > 0;
  };

  return VisitC;

})();

app.controller('VisitC', VisitC);

var VisitEditC;

VisitEditC = (function() {
  function VisitEditC(edit, dataset_id, $uibModalInstance, VisitF, DatasetF, ValidatorF) {
    var i, len, ref, v;
    if (edit) {
      this.edit = this.pruneNA(edit);
    }
    this.data = {};
    if (!this.edit && dataset_id) {
      this.data = {
        dataset_id: dataset_id
      };
    }
    if (this.edit) {
      this.data = edit;
    }
    this.$uibModalInstance = $uibModalInstance;
    ref = VisitF.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      v = ref[i];
      if (v.field === 'collection_method') {
        this.collectionMethods = v.options;
      }
    }
    this.DatasetF = DatasetF;
    this.ValidatorF = ValidatorF;
    this.VisitF = VisitF;
    this.getDataset();
  }

  VisitEditC.prototype.getDataset = function() {
    return this.DatasetF.getDatasets().then((function(_this) {
      return function(datasets) {
        return _this.datasets = datasets;
      };
    })(this));
  };

  VisitEditC.prototype.submit = function() {
    if (this.edit) {
      return this.VisitF.editVisit(this.data.visit_id, this.data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    } else {
      return this.VisitF.createVisit(this.data).then((function(_this) {
        return function() {
          return _this.$uibModalInstance.close(true);
        };
      })(this));
    }
  };

  VisitEditC.prototype.cancel = function() {
    return this.$uibModalInstance.dismiss();
  };

  VisitEditC.prototype.pruneNA = function(data) {
    var k, result, v;
    result = {};
    for (k in data) {
      v = data[k];
      result[k] = v === 'NA' ? null : v;
    }
    return result;
  };

  return VisitEditC;

})();

app.controller('VisitEditC', VisitEditC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('VisitF', function(ApiF, ValidatorF, $uibModal) {
  var VisitF;
  VisitF = {};
  VisitF.fields = [
    {
      field: 'visit_id',
      title: 'ID',
      visible: false,
      noEdit: true
    }, {
      field: 'dataset_name',
      title: 'Dataset',
      visible: true,
      noEdit: true
    }, {
      field: 'dataset_id',
      visible: false
    }, {
      field: 'date',
      title: 'Date',
      visible: true,
      format: 'date'
    }, {
      field: 'habitat',
      title: 'Habitat',
      visible: true,
      required: true
    }, {
      field: 'min_rainfall',
      title: 'Min. Rainfall',
      visible: true,
      format: 'number',
      unit: 'mm'
    }, {
      field: 'max_rainfall',
      title: 'Max. Rainfall',
      visible: true,
      format: 'number',
      unit: 'mm'
    }, {
      field: 'min_temperature',
      title: 'Min. Temperature',
      visible: true,
      format: 'number',
      unit: '°C'
    }, {
      field: 'max_temperature',
      title: 'Max. Temperature',
      visible: true,
      format: 'number',
      unit: '°C'
    }, {
      field: 'min_elevation',
      title: 'Min. Elevation',
      visible: true,
      format: 'number',
      unit: 'm'
    }, {
      field: 'max_elevation',
      title: 'Max. Elevation',
      visible: true,
      format: 'number',
      unit: 'm'
    }, {
      field: 'collection_method',
      title: 'Collection method',
      visible: true,
      options: ['NA', 'pipet', 'dissection', 'washing', 'beating', 'incomplete']
    }, {
      field: 'latitude',
      title: 'latitude',
      visible: true,
      format: 'lat',
      unit: 'DD'
    }, {
      field: 'longitude',
      title: 'longitude',
      visible: true,
      format: 'lng',
      unit: 'DD'
    }, {
      field: 'meta',
      title: 'meta',
      visible: false
    }
  ];
  VisitF.showVisit = function(visit_id) {
    return $uibModal.open({
      templateUrl: 'visit/view.html',
      controller: 'VisitViewC',
      controllerAs: 'visit',
      resolve: {
        visit_id: function() {
          return visit_id;
        }
      }
    });
  };
  VisitF.getVisits = function(dataset_id) {
    var params;
    params = dataset_id != null ? {
      dataset_id: dataset_id
    } : {};
    return ApiF.get('visits', 'list', {
      params: params
    });
  };
  VisitF.getVisitById = function(visit_id) {
    return ApiF.get('visits', 'list', {
      params: {
        visit_id: visit_id
      }
    }).then(function(visits) {
      if (!visits || visits.length < 1) {
        throw new Error("Visit not found");
      } else {
        return visits[0];
      }
    });
  };
  VisitF.deleteVisits = function(visits) {
    return ApiF.postWithLoading('visits', 'delete', null, {
      visits: visits
    });
  };
  VisitF.createVisit = function(visit) {
    visit = VisitF.omitEmptyFields(visit);
    visit = VisitF.requestFields(visit);
    VisitF.validateVisit(visit);
    return ApiF.postWithLoading('visits', 'new', null, {
      visits: [visit]
    }, VisitF.unmapError);
  };
  VisitF.editVisit = function(visit_id, visit) {
    var data;
    visit = VisitF.emptyToNull(visit);
    visit = VisitF.requestFields(visit);
    VisitF.validateVisit(visit);
    visit = _.omit(visit, 'visit_id');
    data = {
      visits: {}
    };
    data.visits[visit_id] = visit;
    return ApiF.postWithLoading('visits', 'edit', null, data, VisitF.unmapError);
  };
  VisitF.validateVisit = function(visit) {
    var i, len, ref, ref1, results, row;
    if (visit.dataset_id == null) {
      throw new Error("Select a dataset from the dropdown menu");
    }
    ref = VisitF.fields;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      if (!(!row.noEdit)) {
        continue;
      }
      if (row.required && (!visit[row.field] || visit[row.field].trim() === '')) {
        throw new Error(row.title + " is required");
      }
      if (row.options && (ref1 = visit[row.field], indexOf.call(row.options, ref1) < 0)) {
        throw new Error(row.title + " must be one the options");
      }
      if (row.format) {
        switch (row.format) {
          case 'date':
            results.push(ValidatorF.validateDate(row.title, visit[row.field]));
            break;
          case 'number':
            results.push(ValidatorF.validateNumber(row.title, visit[row.field]));
            break;
          case 'lat':
            results.push(ValidatorF.validateLat(row.title, visit[row.field]));
            break;
          case 'lng':
            results.push(ValidatorF.validateLng(row.title, visit[row.field]));
            break;
          default:
            results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  VisitF.omitEmptyFields = function(visit) {
    return _.omit(visit, function(value, key, object) {
      return typeof value === 'string' && value.trim() === "";
    });
  };
  VisitF.requestFields = function(visit) {
    var fields, row;
    fields = (function() {
      var i, len, ref, results;
      ref = VisitF.fields;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        row = ref[i];
        if (!row.noEdit) {
          results.push(row.field);
        }
      }
      return results;
    })();
    return _.pick(visit, fields);
  };
  VisitF.emptyToNull = function(visit) {
    return _.mapObject(visit, function(value) {
      if (typeof value === 'string' && value.trim() === "") {
        return null;
      } else {
        return value;
      }
    });
  };
  VisitF.unmapError = function(error) {
    var c, i, len, ref;
    ref = VisitF.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      c = ref[i];
      error = error.replace("'" + c.field + "'", "<b>" + c.title + "</b>");
    }
    return error;
  };
  return VisitF;
});

var VisitViewC;

VisitViewC = (function() {
  function VisitViewC(VisitF, visit_id, $uibModalInstance) {
    this.VisitF = VisitF;
    this.loadVisit(visit_id);
    this.dismiss = $uibModalInstance.dismiss;
  }

  VisitViewC.prototype.loadVisit = function(visit_id) {
    return this.VisitF.getVisitById(visit_id).then((function(_this) {
      return function(visit) {
        return _this.data = visit;
      };
    })(this));
  };

  return VisitViewC;

})();

app.controller('VisitViewC', VisitViewC);

app.factory('ApiF', function(UserF, ConstantsF, $http, $q, DialogF) {
  var ApiF;
  ApiF = {};
  ApiF.setOptionsHeader = function(options) {
    var auth_header;
    auth_header = "bearer " + UserF.token;
    if (options) {
      if (options.headers) {
        return options.headers['Authorization'] = auth_header;
      } else {
        return options.headers = {
          'Authorization': auth_header
        };
      }
    } else {
      return options = {
        headers: {
          'Authorization': auth_header
        }
      };
    }
  };
  ApiF.failCallback = function(res, unmap) {
    var data;
    if (unmap == null) {
      unmap = null;
    }
    data = res.data;
    if (typeof data === 'string') {
      console.error(data);
      throw new Error("Got a non-JSON response, check console logs.");
    } else {
      if (res.status === 403) {
        throw new Error(data.error);
      } else if (res.status === 412) {
        return $q.reject(data.error);
      } else {
        if (unmap != null) {
          throw new Error(unmap(data.error));
        } else {
          throw new Error(data.error);
        }
      }
    }
  };
  ApiF.successCallback = function(res) {
    var data;
    data = res.data;
    if (typeof data === 'string') {
      console.error(data);
      throw new Error("Got a non-JSON response, check console logs.");
    } else {
      if (data.success !== true) {
        console.error(data);
        throw new Error("Sanity check failed. Success field is false");
      }
      return data.results;
    }
  };
  ApiF.get = function(route, action, options) {
    var path;
    if (!UserF.token) {
      return $q.reject();
    }
    path = ConstantsF.getPath(route, action);
    options || (options = {});
    ApiF.setOptionsHeader(options);
    return $http.get(path, options).then(ApiF.successCallback, ApiF.failCallback);
  };
  ApiF.post = function(route, action, options, data, unmap) {
    var path;
    if (!UserF.token) {
      return $q.reject();
    }
    path = ConstantsF.getPath(route, action);
    options || (options = {});
    ApiF.setOptionsHeader(options);
    return $http.post(path, data, options).then(ApiF.successCallback, (function(_this) {
      return function(res) {
        return ApiF.failCallback(res, unmap);
      };
    })(this));
  };
  ApiF.postWithLoading = function(route, action, options, data, unmap) {
    return DialogF.loadingDialog(ApiF.post(route, action, options, data, unmap));
  };
  return ApiF;
});

app.constant("BromeliadHelp", {
  'habitat': "The “Dataset-Visit habitat (Date)” field should autofill. O campo “Dataset-Visit Habitat (Date)” será preenchido automaticamente.",
  'date': "The actual bromeliad, not the whole field season.  Data da coleta da Bromélia em questão, não a data de início da visita.",
  'original_id': "This should exactly match your field notes, do not change bromeliad identifiers. Deve ser usado a identificação da bromélia feita em campo, não altere as identificações.",
  'species': "Please ensure this is spelt correctly. If genus only identification, use this form: genus sp.”  Assegure-se que o nome da espécie esteja escrito corretamente. Se a única identificação for o gênero, usar o formato “gênero sp.”",
  'water': "Actual: Volume of water present in the bromeliad (ml). Volume de água presente na bromélia (ml). Max: Maximum water volume bromeliad can held (ml). Volume máximo de água que a bromélia pode reter (ml)",
  'height': "Height above ground: enter 0 if the bromeliad was growing on the ground, a positive number if epiphytic bromeliad, leave as NA if data missing. Altura acima do solo: 0 se a bromélia estiver crescendo no chão; número positivo se for uma bromélia epífita; NA se não tiver esse dado.",
  'diameter': "Horizontal distance from one side of the plant to the other (cm). Distância horizontal de uma extremidade a outra da pl)ncia horizontal de uma extremidade a outra da planta, com as folhas extendidas manualmente a sua máxima extensão.anta (cm).",
  'extended_diameter': "This is the horizontal distance from one side of the plant to the other, with the leaves pulled by hand to their maximal extent. Distância horizontal de uma extremidade a outra da planta, com as folhas extendidas manualmente a sua máxima extensão.",
  'leaf_width': "Width across the middle bromeliad leaf, taken at the leaf base. Largura da folha do meio da bromélia, medida na base da folha.",
  'num_leaf': "The number of water-holding leaves. Número de folhas capazes de reter água.",
  'longest_leaf': "The length of the longest bromeliad leaf, from its base to its tip. Comprimento da maior folha da bromélia, da base até a ponta.",
  'attribute': "Extra information, for example: ant nest, spider presence. Informações extra, por exemplo: ninho de formiga, presença de aranhas.",
  'value': "In general: present or absent. Em geral: presente ou ausente.",
  'add_attribute': "Add more extra information. Adicionar mais informações extra.",
  'detritus_dry_mass': "To insert detritus information. Para inserir informação sobre detrito.",
  'detritus_min': "Size of particulate, the lower bound of the sieve. Tamanho do particulado, limite inferior da peneira.",
  'detritus_max': "Size of particulate, the upper bound of the sieve. Tamanho do particulado, limite superior da peneira.",
  'detritus_mass': "Dry mass of detritus in g. Massa seca de detrito em g."
});

var ConfirmC;

ConfirmC = (function() {
  function ConfirmC($scope, message, doubleConfirm) {
    $scope.message = message;
    $scope.doubleConfirm = doubleConfirm;
  }

  return ConfirmC;

})();

app.controller('ConfirmC', ConfirmC);

app.factory('ConstantsF', function() {
  return {
    API_PATH: APP_CONST_PATH,
    LOGIN_URL: '/login.html',
    getPath: function(route, action) {
      return this.API_PATH + "?route=" + route + "&action=" + action;
    },
    COUNTRIES: ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"]
  };
});

app.factory('DialogF', function(ngDialog) {
  var DialogF;
  DialogF = {};
  DialogF.successDialog = function(message) {
    return ngDialog.openConfirm({
      template: 'successDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: function() {
          return message;
        }
      }
    });
  };
  DialogF.confirmDialog = function(message) {
    return ngDialog.openConfirm({
      template: 'confirmDialog.html',
      controller: 'ConfirmC',
      resolve: {
        doubleConfirm: function() {
          return null;
        },
        message: function() {
          return message;
        }
      }
    });
  };
  DialogF.loadingDialog = function(promise) {
    return ngDialog.openConfirm({
      template: 'loading.html',
      controller: (function(_this) {
        return function($scope) {
          return promise.then(function(results) {
            return $scope.confirm(results);
          }, function(reason) {
            return $scope.closeThisDialog(reason);
          });
        };
      })(this)
    });
  };
  return DialogF;
});

var ErrorC;

app.config(function($provide) {
  return $provide.decorator("$exceptionHandler", function($delegate, $injector) {
    return function(exception, cause) {
      var ngDialog;
      ngDialog = $injector.get("ngDialog");
      ngDialog.open({
        template: 'errorDialog.html',
        controller: ErrorC,
        resolve: {
          message: function() {
            return exception.message;
          }
        }
      });
      return console.error(exception, cause);
    };
  });
});

ErrorC = function($scope, message) {
  return $scope.message = message;
};

app.factory('FileParserF', function($q) {
  var FileParserF;
  FileParserF = {};
  FileParserF.parse = function(file, options) {
    var deferred;
    deferred = $q.defer();
    options || (options = {});
    options.complete = function(results) {
      return deferred.resolve(results.data);
    };
    options.error = function(err) {
      return deferred.reject(err);
    };
    Papa.parse(file, options);
    return deferred.promise;
  };
  return FileParserF;
});

app.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model;
      model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if (value === true) {
          return $timeout(function() {
            return element[0].focus();
          });
        }
      });
      return element.bind('blur', function() {
        return scope.$apply(model.assign(scope, false));
      });
    }
  };
});

var HelpC;

HelpC = (function() {
  function HelpC(type, MarkdownF, $uibModalInstance) {
    this.MarkdownF = MarkdownF;
    this.getMarkdown(type);
    this.dismiss = $uibModalInstance.dismiss;
  }

  HelpC.prototype.getMarkdown = function(type) {
    return this.MarkdownF.getMarkdown(type).then((function(_this) {
      return function(markdown) {
        return _this.markdown = markdown;
      };
    })(this));
  };

  return HelpC;

})();

app.controller('HelpC', HelpC);

app.factory('HelpF', function($uibModal) {
  var HelpF;
  HelpF = {};
  HelpF.openHelp = function(type) {
    return $uibModal.open({
      templateUrl: 'help.html',
      controller: 'HelpC',
      controllerAs: 'help',
      resolve: {
        type: function() {
          return type;
        }
      }
    });
  };
  return HelpF;
});

var LocalStorage;

LocalStorage = (function() {
  LocalStorage.prototype.set = function(value) {
    if (this.localStorageService.set(this.key, value)) {
      return this.storages[this.key] = value;
    } else {
      throw new Error('Error writing to LocalStorage');
    }
  };

  LocalStorage.prototype.unset = function() {
    delete this.storages[this.key];
    return this.localStorageService.remove(this.key);
  };

  LocalStorage.prototype.get = function() {
    return this.storages[this.key] || this.localStorageService.get(this.key);
  };

  function LocalStorage(storages, localStorageService1, key) {
    this.storages = storages;
    this.localStorageService = localStorageService1;
    this.key = key;
  }

  return LocalStorage;

})();

app.factory('LocalStorageF', function(localStorageService) {
  var LocalStorageF;
  LocalStorageF = {};
  LocalStorageF.storages = {};
  LocalStorageF.token = new LocalStorage(LocalStorageF.storages, localStorageService, 'token');
  LocalStorageF.speciesState = new LocalStorage(LocalStorageF.storages, localStorageService, 'speciesState');
  return LocalStorageF;
});

var LoginDialogC;

LoginDialogC = (function() {
  function LoginDialogC(UserF, $scope, $window, $q, DialogF) {
    $scope.submit = function(username, password) {
      $scope.error = null;
      $scope.loggingIn = true;
      return UserF.login(username, password)["catch"]((function(_this) {
        return function(res) {
          var data;
          $scope.loggingIn = false;
          data = res.data;
          if (!(data != null ? data.error : void 0)) {
            throw new Error('Unknown error signing in');
          }
          $scope.error = data.error;
          return $q.reject();
        };
      })(this)).then((function(_this) {
        return function(success) {
          $scope.loggingIn = false;
          if (success) {
            $scope.closeThisDialog();
            return $window.location.reload();
          }
        };
      })(this));
    };
    $scope.forget = function(email) {
      return UserF.sendRecoveryEmail(email).then(function() {
        return DialogF.successDialog("Check your mailbox for a password recovery link");
      })["catch"](function(res) {
        var ref;
        throw new Error(res != null ? (ref = res.data) != null ? ref.error : void 0 : void 0);
      });
    };
  }

  return LoginDialogC;

})();

app.controller('LoginDialogC', LoginDialogC);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.factory('MarkdownF', function(ApiF, ngDialog) {
  var MarkdownF;
  MarkdownF = {};
  MarkdownF.MAX_SIZE_MB = 10;
  MarkdownF.SUPPORTED_TYPES = ['image/jpeg', 'image/png'];
  MarkdownF.markdowns = [
    {
      type: 'dashboard',
      title: 'Announcements'
    }, {
      type: 'species-upload',
      title: 'Species Upload'
    }, {
      type: 'bromeliad-upload',
      title: 'Bromeliad Upload'
    }
  ];
  MarkdownF.getMarkdown = function(type) {
    return ApiF.get('markdowns', 'list', {
      params: {
        type: type
      }
    }).then(function(arg) {
      var markdown;
      markdown = arg[0];
      return markdown.markdown;
    });
  };
  MarkdownF.updateMarkdown = function(type, markdown) {
    return ApiF.postWithLoading('markdowns', 'edit', null, {
      type: type,
      markdown: markdown
    });
  };
  MarkdownF.uploadDialog = function() {
    return ngDialog.openConfirm({
      template: 'admin/uploadImage.html',
      controller: 'AdminMarkdownUploadC',
      controllerAs: 'admin'
    });
  };
  MarkdownF.validateType = function(type) {
    if (indexOf.call(MarkdownF.SUPPORTED_TYPES, type) < 0) {
      throw new Error("File type not supported. Please select a JPEG or PNG file.");
    }
  };
  MarkdownF.validateSize = function(size) {
    if (size > (MarkdownF.MAX_BYTE_SIZE * 1024 * 1024)) {
      throw new Error("File size exceeded 10MB");
    }
  };
  MarkdownF.uploadFile = function(file) {
    var formData, options;
    formData = new FormData();
    formData.append('file', file);
    options = {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': void 0
      }
    };
    return ApiF.post('markdowns', 'upload', options, formData).then(function(results) {
      return results.unique_name;
    });
  };
  return MarkdownF;
});

app.directive('resize', function($window) {
  return function(scope, element, attr) {
    var w;
    w = angular.element($window);
    scope.$watch(function() {
      return {
        h: w.height(),
        w: w.width()
      };
    }, function(newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;
      return scope.resizeWithOffset = function(offsetH) {
        return {
          height: newValue.h - 138 + 'px'
        };
      };
    }, true);
    return w.bind('resize', function() {
      return scope.$apply();
    });
  };
});

app.directive('uploader', function() {
  return {
    restrict: 'E',
    templateUrl: 'utils/uploader.html',
    scope: {
      onUpload: '&'
    },
    link: function(scope, element, attrs) {
      var _getDataTransfer, _getDropzone, dropzone, handleFile, processDrag, resetFileInput;
      _getDropzone = function() {
        return dropzone || element.find('.uploader');
      };
      _getDataTransfer = function(event) {
        var dataTransfer;
        dataTransfer = null;
        return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
      };
      resetFileInput = function(e) {
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          return e.preventDefault();
        }
      };
      handleFile = function(file) {
        return scope.$apply(function() {
          return scope.onUpload({
            file: file
          });
        });
      };
      processDrag = function(event) {
        var dropzone;
        dropzone = _getDropzone();
        if (event) {
          dropzone.addClass('uploader-hover');
          if (event.preventDefault) {
            event.preventDefault();
          }
          if (event.stopPropagation) {
            return false;
          }
        }
        _getDataTransfer(event).effectAllowed = 'copy';
        return false;
      };
      $('.uploader').click(function() {
        return $('.uploader-input').click();
      });
      $('.uploader-input').on('change', function(event) {
        var ref, ref1;
        if ((ref = $('.uploader-input')[0]) != null ? (ref1 = ref.files) != null ? ref1[0] : void 0 : void 0) {
          handleFile($('.uploader-input')[0].files[0]);
          return resetFileInput($('.uploader-input'));
        }
      });
      dropzone = _getDropzone();
      dropzone.bind('dragover', processDrag);
      dropzone.bind('dragenter', processDrag);
      dropzone.bind('dragleave', function() {
        return dropzone.removeClass('uploader-hover');
      });
      return dropzone.bind('drop', function(event) {
        var file;
        if (event != null) {
          event.preventDefault();
        }
        dropzone.removeClass('uploader-hover');
        file = _getDataTransfer(event).files[0];
        handleFile(file);
        return false;
      });
    }
  };
});

app.factory('UserF', function(LocalStorageF, ConstantsF, ngDialog, $window, $http, $q, $state) {
  var UserF;
  UserF = {};
  UserF.GET_USER_API = ConstantsF.getPath('users', 'current');
  UserF.LOGIN_USER_API = ConstantsF.getPath('users', 'login');
  UserF.RESET_API = ConstantsF.getPath('users', 'reset');
  UserF.RECOVER_API = ConstantsF.getPath('users', 'recover');
  UserF.getUser = function() {
    if (UserF.user) {
      return $q.when(UserF.user);
    }
    return UserF.signIn();
  };
  UserF.header = function() {
    if (!UserF.token) {
      return;
    }
    return {
      'Authorization': 'bearer ' + UserF.token
    };
  };
  UserF.signIn = function() {
    if (!UserF.token) {
      UserF.token = LocalStorageF.token.get();
      if (!UserF.token) {
        UserF.showLogin();
        return $q.reject();
      }
    }
    return UserF.loadUser(UserF.token);
  };
  UserF.loadUser = function(token) {
    var options;
    options = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    return $http.get(UserF.GET_USER_API, options).then(function(res) {
      var user;
      user = res.data.results.user;
      UserF.setUser(user);
      return user;
    }, function(error) {
      UserF.token = null;
      LocalStorageF.token.unset();
      return $window.location.reload();
    });
  };
  UserF.setUser = function(user) {
    return UserF.user = user;
  };
  UserF.showLogin = function() {
    return ngDialog.open({
      template: 'loginDialog.html',
      controller: 'LoginDialogC',
      showClose: false,
      closeByEscape: false,
      closeByDocument: false
    });
  };
  UserF.setAvatar = function() {
    return ngDialog.openConfirm({
      template: 'users/avatar.html',
      controller: 'UserAvatarC',
      controllerAs: 'user'
    });
  };
  UserF.sendRecoveryEmail = function(email) {
    return $http.post(UserF.RECOVER_API, {
      email: email
    });
  };
  UserF.resetPassword = function(token, password) {
    var data;
    data = {
      token: token,
      password: password
    };
    return $http.post(UserF.RESET_API, data)["catch"](function(res) {
      throw new Error(res != null ? res.data.error : void 0);
    });
  };
  UserF.login = function(username, password) {
    var data;
    data = {
      username: username,
      password: password
    };
    return $http.post(UserF.LOGIN_USER_API, data).then(function(res) {
      var ref, ref1, token;
      if (!(res != null ? (ref = res.data) != null ? (ref1 = ref.results) != null ? ref1.token : void 0 : void 0 : void 0)) {
        console.error("Cannot find token from response: ", JSON.stringify(res));
      }
      UserF.token = token = res.data.results.token;
      LocalStorageF.token.set(token);
      return true;
    });
  };
  UserF.logout = function() {
    delete UserF.user;
    delete UserF.token;
    LocalStorageF.token.unset();
    return $state.go('dashboard').then(function() {
      return $window.location.reload();
    });
  };
  return UserF;
});

app.factory('ValidatorF', function() {
  var ValidatorF;
  ValidatorF = {};
  ValidatorF.validateDate = function(title, value) {
    var date, month, parts, ref, ref1, year;
    if (!(value && value.length > 0)) {
      return;
    }
    parts = value.split('-');
    if (parts.length !== 3) {
      throw new Error(title + " must be in the format of YYYY-MM-DD");
    }
    year = parts[0], month = parts[1], date = parts[2];
    if (isNaN(parts[0])) {
      throw new Error(title + "'s year must be a number");
    }
    if (isNaN(parts[1])) {
      throw new Error(title + "'s month must be a number");
    }
    if (isNaN(parts[2])) {
      throw new Error(title + "'s date must be a number");
    }
    if (year < 1900 || year > 2100) {
      throw new Error(title + "'s year must be after 1900 and before 2100");
    }
    if (month < 1 || month > 12) {
      throw new Error(title + "'s month is invalid");
    }
    if (date < 1) {
      throw new Error(title + "'s date is invalid");
    }
    if (((ref = parseInt(month)) === 1 || ref === 3 || ref === 5 || ref === 7 || ref === 8 || ref === 10 || ref === 12) && date > 31) {
      throw new Error(title + "'s date is invalid for the month");
    }
    if (((ref1 = parseInt(month)) === 4 || ref1 === 6 || ref1 === 9 || ref1 === 11) && date > 30) {
      throw new Error(title + "'s date is invalid for the month");
    }
    if (parseInt(month) === 2 && date > 29) {
      throw new Error(title + "'s date is invalid for the month");
    }
  };
  ValidatorF.validateNumber = function(title, value, allowNA) {
    var num;
    if (allowNA == null) {
      allowNA = false;
    }
    if (allowNA && value === 'NA') {
      return;
    }
    if (!(value && value.length > 0)) {
      return;
    }
    if (isNaN(num = parseFloat(value))) {
      throw new Error(title + " must be a number");
    }
  };
  ValidatorF.validateLat = function(title, value) {
    if (!(value && value.length > 0)) {
      return;
    }
    if (isNaN(value)) {
      throw new Error("Latitude must be a number");
    }
    if (value < -90 || value > 90) {
      throw new Error("Latitude must be between -90 to 90");
    }
  };
  ValidatorF.validateLng = function(title, value) {
    if (!(value && value.length > 0)) {
      return;
    }
    if (isNaN(value)) {
      throw new Error("Longitude must be a number");
    }
    if (value < -180 || value > 180) {
      throw new Error("Longitude must be between -180 to 180");
    }
  };
  return ValidatorF;
});
