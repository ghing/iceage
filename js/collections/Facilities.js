define([
  'backbone',
  'models/Facility'
], function(Backbone, Facility) {
  return Backbone.Collection.extend({
    model: Facility,

    url: './data/facilities.json',

    initPositions: function(proj) {
      this.each(function(model) {
        model.initPosition(proj);
      });
      this.trigger('positionsset');
    }
  });
});
