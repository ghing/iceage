define([
  'backbone',
  'd3',
], function(Backbone, d3) {
  return {
    renderStates: function(el, states, path) {
      el.selectAll("path")
        .data(states.toJSON())
        .enter().append("svg:path")
        .attr("d", path);

      return this;
    }
  };
});
