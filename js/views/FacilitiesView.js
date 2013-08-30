define([
  'underscore',
  'backbone',
  'd3',
  'views/FacilitiesViewMixin'
], function(_, Backbone, d3, FacilitiesViewMixin) {
  return Backbone.View.extend(_.extend({}, FacilitiesViewMixin, {
    options: {
      pointSize: 5
    },

    initialize: function() {
      this.d3El = this.options.d3El;

      this.deportations = this.options.deportations;
      this.detentions = this.options.detentions;

      this.collection.on('sync', this.renderInitial, this);
      Backbone.on(this.options.dateEvent, this.updateDate, this);
    },

    updateDate: function(date, mDate) {
      var detentions = this.detentions.get(date);
      var deportations = this.deportations.get(date);

      this.d3El.selectAll('path')
        .attr("fill", function(d) {
         if (detentions && $.inArray(d.id, detentions.get('facilities')) !== -1) {
           return "yellow";
         }
         else if (deportations && $.inArray(d.id, deportations.get('facilities')) !== -1) {
           return "red";
         }
         else {
           return "black";
         }
        });
    },

    renderInitial: function() {
      return this.renderFacilities(this.d3El, this.collection, this.options.path);
    }
  }));
});
