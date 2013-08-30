define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.Model.extend({
    getCoordinates: function() {
      return [this.get('longitude'), this.get('latitude')];
    },

    toGeoJSON: function() {
      return {
        type: "Point",
        coordinates: this.getCoordinates(),
        id: this.id 
      };
    }
  });
});
