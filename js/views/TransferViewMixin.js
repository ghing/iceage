define([
  'backbone',
  'd3',
], function(Backbone, d3) {
  return {
    renderTransfers: function(el, transfers, facilities, path, remove) {
      // Convert to GeoJSON feature
      var transferFeatures = _.map(transfers, function(transfer) {
        var fromId = transfer[0];
        var toId = transfer[1];
        var fromCoords = facilities.get(fromId).getCoordinates();
        var toCoords = facilities.get(toId).getCoordinates();
        return {
          type: "LineString",
          coordinates: [fromCoords, toCoords],
          id: fromId + ":" + toId 
        };
      }, this);
      el.selectAll("path")
        .data(transferFeatures, function(d) { return d.id; })
        .enter().append("path")
        .attr("d", path)
        .attr("stroke-width", this.options['stroke-width'])
        .attr("stroke", this.options.stroke);

      if (remove) {
        lines.exit().remove();
      }

      return this;
    }
  };
});
