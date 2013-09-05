define([
  'backbone',
  'models/Facility'
], function(Backbone, Facility) {
  var Facilities = Backbone.Collection.extend({
    model: Facility,

    url: './data/facilities.json',

    toGeoJSON: function() {
      return {
          type: 'FeatureCollection',
          features: this.map(function(facility) {
            return facility.toGeoJSON();
          })
      }
    },

    // Like filter(), but returns a collection instead of an array
    filterCollection: function(iterator) {
      return new Facilities(this.filter(iterator));
    }
  });

  return Facilities;
});
