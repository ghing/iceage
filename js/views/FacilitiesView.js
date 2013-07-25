define([
  'backbone',
  'd3'
], function(Backbone, d3) {
  return Backbone.View.extend({
    options: {
      pointSize: 5
    },

    initialize: function() {
      this.d3El = this.options.d3El;

      this.deportations = this.options.deportations;
      this.detentions = this.options.detentions;

      this.collection.on('sync', _.partial(this.collection.initPositions, this.options.projection), this.collection);
      this.collection.on('positionsset', this.renderInitial, this);
      Backbone.on(this.options.dateEvent, this.updateDate, this);
    },

    updateDate: function(date, mDate) {
      var detentions = this.detentions.get(date);
      var deportations = this.deportations.get(date);

      this.d3El.selectAll('circle')
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
      var view = this;
      this.d3El.selectAll("circle")
         .data(this.collection.models, function(d) { return d.id; })
         .enter().append("svg:circle")
         .attr("data-facility-id", function(d, i) { return d.id; })
         .attr("cx", function(d, i) { return view.collection.get(d.id).getPosition()[0]; })
         .attr("cy", function(d, i) { return view.collection.get(d.id).getPosition()[1]; })
         .attr("r", function(d, i) { return view.options.pointSize; });

      return this;
    }
  });
});
