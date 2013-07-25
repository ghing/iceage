define([
  'backbone',
  'd3'
], function(Backbone, d3) {
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
      if (transfers) {
        transfers = transfers.get('transfers');
        lines =  this.d3El.selectAll("line")
                   .data(transfers, function(d) { return d; });

        lines.enter().append("svg:line")
                     .attr("x1", function(d, i) { return view.facilities.get(d[0]).getPosition()[0]; })
                     .attr("y1", function(d, i) { return view.facilities.get(d[0]).getPosition()[1]; })
                     .attr("x2", function(d, i) { return view.facilities.get(d[1]).getPosition()[0]; })
                     .attr("y2", function(d, i) { return view.facilities.get(d[1]).getPosition()[1]; })
                     .attr("stroke-width", view.options['stroke-width'])
                     .attr("stroke", view.options.stroke);
        // Commented out, so we can show all the connections
        //lines.exit().remove();
        //
      }
      return this;
    }
  });
});
