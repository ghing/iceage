define([
  'backbone',
  'd3',
  'views/FacilitiesView',
  'views/TransfersView'
], function(Backbone, d3, FacilitiesView, TransfersView) {
  return Backbone.View.extend({
    // Get a DOM element from a D3 selector
    // via http://stackoverflow.com/a/10341307/386210
    d3ToEl: function(d3Sel) {
      return d3Sel[0][0]; 
    },

    initialize: function() {
      // Initialize the svg elements
      var width = this.$el.width();
      var height = $(window).height(); // Or do we have to do $(window).height();
      var scale = 1200;
      var projection = d3.geo.albersUsa()
          .scale(scale)
          .translate([width / 2, height / 2]);
      var facilityCircles, transferLines;

      this.path = d3.geo.path()
          .projection(projection);
      this.d3El = d3.select(this.$el.selector).insert("svg:svg")
          .attr("width", width)
          .attr("height", height);

      this.states = this.d3El.append("svg:g")
          .attr("id", "states");

      facilityCircles = this.d3El.append("svg:g")
          .attr("id", "facilities");

      transferLines = this.d3El.append("svg:g")
          .attr("id", "transfers");

      this.statesCollection = this.options.states;
      this.statesCollection.on('sync', this.renderStates, this);
      this.facilitiesCollection = this.options.facilities;

      // Add subviews
      this.facilitiesView = new FacilitiesView({
        el: this.d3ToEl(facilityCircles),
        collection: this.options.facilities,
        detentions: this.options.detentions,
        deportations: this.options.deportations,
        d3El: facilityCircles,
        projection: projection,
        dateEvent: this.options.dateEvent
      });

      this.transfersView = new TransfersView({
        el: this.d3ToEl(transferLines),
        collection: this.options.transfers,
        facilities: this.options.facilities,
        d3El: transferLines,
        dateEvent: this.options.dateEvent
      });

    },

    renderStates: function() {
      this.states.selectAll("path")
            .data(this.statesCollection.toJSON())
            .enter().append("svg:path")
            .attr("d", this.path);
    }
  });
});
