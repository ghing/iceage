define([
  'backbone',
  'd3',
  'bootstrap'
], function(Backbone, d3, bootstrap)  {
  return Backbone.View.extend({
    options: {
      projection: d3.geo.albersUsa,
      scale: 1200
    },

    initialize: function() {
      this.characterEvents = this.options.characterEvents;
      this.facilities = this.options.facilities;
      this.states = this.options.states;
      /*
      var width = this.$el.width();
      var height = this.$el.height();
      var projection = this.options.projection()
          .scale(this.options.scale)
          .translate([width / 2, height / 2]);

      this.path = d3.geo.path()
          .projection(projection);
      this.d3El = d3.select(this.$el.selector).insert("svg:svg")
          .attr("width", width)
          .attr("height", height);

      this.statesLayer = this.d3El.append("svg:g")
          .attr("id", "character-states");

      this.facilitiesLayer = this.d3El.append("svg:g")
          .attr("id", "character-facilities");

      this.transfersLayer = this.d3El.append("svg:g")
          .attr("id", "character-transfers");

      this.states.on('sync', this.renderStates, this);
      */
      Backbone.on('transfer', this.setTransfer, this);

      this.$el.modal({
        show: false
      });
    },

    setTransfer: function(date, tracId) {
      var transfer = this.characterEvents.where({
        tracId: tracId,
        date: date.format("YYYY-MM-DD")
      })[0];
      var fromFacility = transfer.get('from_facility');
      var toFacility = transfer.get('to_facility');
      if (fromFacility) {
        fromFacility = this.facilities.get(fromFacility);
      }
      if (toFacility) {
        toFacility = this.facilities.get(toFacility);
      }
      // BOOKMARK
      // TODO: Display individual transfer
      this.$el.modal('show');
    },

    renderStates: function() {
      return this;
    },

    render: function() {
      return this;
    }
  });
});
