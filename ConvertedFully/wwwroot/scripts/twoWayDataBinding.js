var chore = chore || {};
(function () {
  chore.TwoWayBindingModel = function (obj) {
    var self = this;
    self._obj = obj || {};
    self.subscribers = {};
    self.subscribersId = 1;
    Object.keys(self._obj).forEach(function (key) {
      Object.defineProperty(self, key, {
        enumerable: true,
        get: self.getValue.bind(self, key),
        set: self.setValue.bind(self, key)
      });
    });
    return self;
  }
  chore.TwoWayBindingModel.prototype.addProperty = function (key, value) {
    var self = this;
    self._obj[key] = value;
    Object.defineProperty(self, key, {
      enumerable: true,
      get: self.getPropertyValue.bind(self, key),
      set: self.setPropertyValue.bind(self, key)
    });
  }
  chore.TwoWayBindingModel.prototype.getPropertyValue = function (key) {
    var self = this;
    return self._obj[key];
  }
  chore.TwoWayBindingModel.prototype.setPropertyValue = function (key, value) {
    var self = this;
    var oldValue = self._obj[key];
    var type = typeof (oldValue);
    var isPrimitive = (oldValue === null || (type === 'undefined' || type === 'boolean' || type === 'number' || type === 'string'));
    var isDifferent = true;
    if (isPrimitive) {
      isDifferent = !(oldValue === value);
    }
    self._obj[key] = value;
    if (isDifferent) {
      self.notifySubscribers(key);
    }
  }
  chore.TwoWayBindingModel.prototype.notifySubscribers = function (key) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      return;
    }
    for (var i = 0; i < subscribers.length; ++i) {
      try {
        var func = subscribers[i].func;
        func.call(null);
      } catch (e) {
        console.log('exception while notifying subscriber ' + e);
      }
    }
  }
  function dispose(key, id) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      return;
    }
    for (var i = 0; i < subscribers.length; ++i) {
      if (subscribers[i].id === id) {
        break;
      }
    }
    if (i < subscribers.length) {
      subscribers.splice(i, 1); //remove from array
    }
  }
  chore.TwoWayBindingModel.prototype.subscribe = function (key, callback) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      subscribers = [];
      self.subscribers[key] = subscribers;
    }
    self.subscribersId++;
    subscribers.push({ func: callback, id: self.subscribersId });
    return {
      dispose: dispose.bind(null, key, self.subscribersId)
    };
  }
}());