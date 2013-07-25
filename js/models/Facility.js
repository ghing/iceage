define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.Model.extend({
    getLocation: function() {
      return [this.get('longitude'), this.get('latitude')];
    },

    // Set a projected position from the facilities Latitude and Longitude
    // coordinates
    initPosition: function(proj) {
      this._position = proj(this.getLocation());
    },

    // Get a projected position from the facilities Latitude and Longitude
    // coordinates
    getPosition: function() {
      return this._position;
    }
  });
});
