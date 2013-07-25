define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  // Singleton that tracks when collections have been synced
  // 
  // Triggers a ``ready`` event when all
  // collections have been initially synced
  return _.extend({
    ready: {},

    collections: {},

    registerOne: function(collection, id) {
      this.ready[id] = false;
      this.collections[id] = collection;
      collection.once('sync', _.partial(this.setReady, id), this);
    },

    register: function(collection, id) {
      if (!_.isUndefined(id)) {
        this.registerOne(collection, id);
      }
      else {
        _.each(collection, function(realCollection, id) {
          this.registerOne(realCollection, id);
        }, this);
      }
    },

    setReady: function(id) {
      this.ready[id] = true;
      this.checkReady();
    },

    checkReady: function() {
      var numFalse = 0;
      _.each(this.ready, function(val, id) {
        if (val !== true) {
          numFalse++;
        }
      }, this);

      if (numFalse === 0) {
          this.trigger("ready");
      }
    },

    fetchAll: function() {
      _.each(this.collections, function(collection, id) {
        collection.fetch();
      });
    }
  }, Backbone.Events);
});
