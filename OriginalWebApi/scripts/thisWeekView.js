var chore = chore || {};

(function () {
  chore.ThisWeekViewModel = function (config) {
    var self = this;
    self.thisWeekChores = [];
    self.users = config.users || [];
    self.selectedUserId = null;
    $("#thisWeekUserSelection").on("change", function () {
      self.selectedUserId = String($("#thisWeekUserSelection").val());
      self.fetch();
    });
  }
  chore.ThisWeekViewModel.prototype = Object.create(Object.prototype);
  chore.ThisWeekViewModel.constructor = chore.ThisWeekViewModel;
  chore.ThisWeekViewModel.prototype.setUsers = function (users) {
    var self = this;
    self.users = users;
    var orgUserId = self.selectedUserId;
    self.selectedUserId = null;
    if (self.users.length) {
      for (var i = 0; i < self.users.length; i++) {
        if (String(self.users[i].Id) === orgUserId) {
          self.selectedUserId = orgUserId;
          break;
        }
      }
    }
    if (!self.selectedUserId) {
      if (self.users.length) {
        self.selectedUserId = String(self.users[0].Id);
      }
    }
    self.fetch();
    chore.executeTemplate($("#thisWeekUserSelection"), self);
    if (self.selectedUserId) {
      $("#thisWeekUserSelection").val(self.selectedUserId);
    }
  }
  chore.ThisWeekViewModel.prototype.choresUpdated = function (userId) {
    var self = this;
    if (self.selectedUserId && String(userId) === self.selectedUserId) {
      self.fetch();
    }
  }
  chore.ThisWeekViewModel.prototype.renderLoading = function (isLoading) {
    var self = this;
    if (isLoading) {
      $("#thisWeekTable").hide();
      $("#thisWeekTableSpinner").show();
    } else {
      $("#thisWeekTable").show();
      $("#thisWeekTableSpinner").hide();
    }
  }
  chore.ThisWeekViewModel.prototype.render = function () {
    var self = this;
    chore.executeTemplate($("#thisWeekTable"), self);
  }
  chore.ThisWeekViewModel.prototype.fetch = function () {
    var self = this;
    if (!self.selectedUserId) {
      self.thisWeekChores = [];
      self.render();
      return;
    }
    self.renderLoading(true);
    return chore.ajax({ url: '/api/thisWeek/' + window.encodeURIComponent(self.selectedUserId) }).done(function (data) {
      self.thisWeekChores = data;
      self.thisWeekChores.map(function (item, idx) {
        item.toggle = function (clickedChore) {
          self.toggle(clickedChore);
        }
      });
      self.renderLoading(false);
      self.render();
    });
  }
  chore.ThisWeekViewModel.prototype.toggle = function (clickedChore) {
    var self = this;
    var obj = { ChoreId: clickedChore.ChoreId, ChildId: clickedChore.ChildId, Day: clickedChore.Day };
    var url = '';
    if (clickedChore.Completed) {
      url = '/api/chores/clear';
    } else {
      url = '/api/chores/complete';
    }
    chore.ajax({ url: url, type: 'POST', data: obj }).done(function () {
      self.fetch();
    });
  }
  
}());