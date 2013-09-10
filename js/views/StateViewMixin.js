define([
  'backbone',
  'd3',
], function(Backbone, d3) {
  return {
    renderStates: function(el, states, path) {
      // Defer rendering until there's actually data
      if (states.length === 0) {
        states.once('sync', function() {
          this.renderStates(el, states, path);
        }, this);
        return this;
      }

      el.selectAll("path")
        .data(states.toJSON())
        .enter().append("svg:path")
        .attr("d", path);

      return this;
    }
  };
});
