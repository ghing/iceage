define([
  'underscore',
  'backbone',
  'd3'
], function(_, Backbone, d3) {
  return Backbone.View.extend({
    options: {
      'stroke-width': 1,
      'stroke': 'blue'
    },

    initialize: function() {
      this.d3El = this.options.d3El;
      this.facilities = this.options.facilities;
      Backbone.on(this.options.dateEvent, this.updateDate, this);
    },

    updateDate: function(date) {
      this.drawTransfers(date);
    },

    drawTransfers: function(date) {
      var view = this;
      var transfers = this.collection.get(date);
      var lines;
      var transferFeatures;

      if (transfers) {
        transfers = transfers.get('transfers');
        // Convert to GeoJSON feature
        transferFeatures = _.map(transfers, function(transfer) {
          var fromId = transfer[0];
          var toId = transfer[1];
          var fromCoords = this.facilities.get(fromId).getCoordinates();
          var toCoords = this.facilities.get(toId).getCoordinates();
          return {
            type: "LineString",
            coordinates: [fromCoords, toCoords],
            id: fromId + ":" + toId 
          };
        }, this);
        lines = this.d3El.selectAll("path")
          .data(transferFeatures, function(d) { return d.id; })
          .enter().append("path")
          .attr("d", this.options.path)
          .attr("stroke-width", view.options['stroke-width'])
          .attr("stroke", view.options.stroke);
        // Commented out, so we can show all the connections
        //lines.exit().remove();
      }
      return this;
    }
  });
});
