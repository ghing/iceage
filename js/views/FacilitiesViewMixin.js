define([
  'backbone',
  'd3',
], function(Backbone, d3) {
  return {
    renderFacilities: function(el, facilities, path) {
      el.selectAll("path")
        .data(facilities.toGeoJSON().features, function(d) { return d.id })
        .enter().append("path")
        .attr("d", path)
        .attr("data-facility-id", function(d, i) { return d.id; });
      return this;
    }
  };
});
