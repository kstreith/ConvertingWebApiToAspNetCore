var chore = chore || {};
(function () {
  chore.UserViewModel = function (config) {
    var self = this;
    chore.TwoWayBindingModel.call(self);
    self.addProperty('users', []);
    self.addProperty('showSpinner', true);
    self.addProperty('showGrid', false);
    self.addProperty('showDeleteModal', false);
    self.addProperty('showAddEditModal', false);
    self.addProperty('showBlockUserModal', false);
    self.addProperty('addEditUserNameValue', "fake");
    self.addProperty('showUserNameValidationError', false);
    self.addEditMode = 'add';
    self.editRecordId = null;
    chore.executeTemplate($(config.selector), self); //set-up two way data-binding to dom
    self.usersUpdatedCallback = config.usersUpdatedCallback;
    self.fetch();
     //VALIDATION-2
    self.subscribe('addEditUserNameValue', function () {
      self.validateUserName();
    });
  }
  chore.UserViewModel.prototype = Object.create(chore.TwoWayBindingModel.prototype);
  chore.UserViewModel.prototype.constructor = chore.UserViewModel;
  chore.UserViewModel.prototype.validate = function () {
    var self = this;
    return self.validateUserName();
  }
  chore.UserViewModel.prototype.validateUserName = function () {
    var self = this;
    var allWhitespaceRegEx = new RegExp("^\\s*$");
    var value = self.getPropertyValue('addEditUserNameValue');
    if (allWhitespaceRegEx.test(value)) {
      self.showUserNameValidationError = true;
    } else {
      self.showUserNameValidationError = false;
    }
    return !self.showUserNameValidationError;
  }
  chore.UserViewModel.prototype.fetch = function () {
    var self = this;
    self.showSpinner = true;
    self.setPropertyValue('showGrid', false);
    return chore.ajax({ url: '/api/users' }).done(function (data) {
      data.forEach(function (item) {
        item.deleteUserClick = function () {
          self.deleteUserClick(item);
        }
        item.editUserClick = function () {
          self.editUserClick(item);
        }
      });
      self.users = data;
      self.setPropertyValue('showSpinner', false);
      self.showGrid = true;
      if (self.usersUpdatedCallback) {
        self.usersUpdatedCallback(self.users);
      }
    });
  }
  chore.UserViewModel.prototype.addUserClick = function () {
    var self = this;
    self.addEditMode = 'add';
    self.addEditUserNameValue = "";
    self.showUserNameValidationError = false; //VALIDATION-3
    self.showAddEditModal = true;
  }
  chore.UserViewModel.prototype.editUserClick = function (rowData) {
    var self = this;
    self.addEditMode = 'edit';
    self.addEditUserNameValue = rowData.Name;
    self.editRecordId = rowData.Id;
    self.showAddEditModal = true;
  }
  chore.UserViewModel.prototype.addEditModalOkClick = function () {
    var self = this;
    //VALIDATION-1    
    if (!self.validate()) {
      //did not validate, so prevent add/edit from working
      return;
    }
    self.showAddEditModal = false;
    self.showBlockUserModal = true;
    if (self.addEditMode === 'add') {
      var name = self.addEditUserNameValue;
      var obj = { Id: -1, Name: name };
      chore.ajax({ url: '/api/users', type: 'POST', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
        self.fetch();
        self.showBlockUserModal = false;
      }).fail(function (jqXHR, textStatus, errorThrown) {
        self.showBlockUserModal = false;
        self.showAddEditModal = true;
        if (String(jqXHR.status) == "400") {
          chore.showErrorMessage('Invalid child, please fix.');
        }
      });
    } else if (self.addEditMode === 'edit') {
      var name = self.addEditUserNameValue;
      var id = self.editRecordId;
      var obj = { Id: id, Name: name };
      chore.ajax({ url: '/api/users/' + window.encodeURIComponent(id), type: 'PUT', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
        self.fetch();
        self.showBlockUserModal = false;
      }).fail(function (jqXHR, textStatus, errorThrown) {
        self.showBlockUserModal = false;
        self.showAddEditModal = true;
        if (String(jqXHR.status) == "400") {
          chore.showErrorMessage('Invalid child, please fix.');
        }
      });
    }
  }
  chore.UserViewModel.prototype.addEditModalCancelClick = function () {
    var self = this;
    self.showAddEditModal = false;
  }
  chore.UserViewModel.prototype.deleteUserClick = function (rowData) {
    var self = this;
    self.deleteRow = rowData;
    self.showDeleteModal = true;
  }
  chore.UserViewModel.prototype.deleteModalOkClick = function () {
    var self = this;
    self.showDeleteModal = false;
    self.showBlockUserModal = true;
    chore.ajax({ url: '/api/users/' + window.encodeURIComponent(self.deleteRow.Id), type: 'DELETE' }).done(function () {
      self.fetch();
      self.showBlockUserModal = false;
    }).fail(function (jqXHR, textStatus, errorThrown) {
      self.showBlockUserModal = false;
      if (String(jqXHR.status) == "409") {
        chore.showErrorMessage('The Child still has chores, you must delete all chores before you can delete the Child.');
      }
    });
  }
  chore.UserViewModel.prototype.deleteModalCancelClick = function () {
    var self = this;
    self.showDeleteModal = false;
  }
}());