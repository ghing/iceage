define([
  'backbone',
  'models/Facility'
], function(Backbone, Facility) {
  return Backbone.Collection.extend({
    model: Facility,

    url: './data/facilities.json',

    toGeoJSON: function() {
      return {
          type: 'FeatureCollection',
          features: this.map(function(facility) {
            return facility.toGeoJSON();
          })
      }
    }
  });
});
