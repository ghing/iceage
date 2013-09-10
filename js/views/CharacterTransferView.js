define([
  'underscore',
  'backbone',
  'd3',
  'bootstrap',
  'views/StateViewMixin',
  'views/FacilitiesViewMixin',
  'views/TransferViewMixin'
], function(_, Backbone, d3, bootstrap, StateViewMixin, FacilitiesViewMixin, TransferViewMixin)  {
  return Backbone.View.extend(_.extend({}, StateViewMixin, FacilitiesViewMixin, TransferViewMixin, {
    options: {
      pointSize: 5,
      projection: d3.geo.albersUsa,
      scale: 1200,
      'stroke-width': 1,
      'stroke': 'blue'
    },

    initialize: function() {
      this.characterEvents = this.options.characterEvents;
      this.facilities = this.options.facilities;
      this.states = this.options.states;
      this.$containerEl = this.$('.modal-body');
      this._statesRendered = false;

      this.d3El = d3.select(this.$containerEl.selector).insert("svg:svg");

      this.statesLayer = this.d3El.append("svg:g")
          .attr("id", "character-states");

      this.facilitiesLayer = this.d3El.append("svg:g")
          .attr("id", "character-facilities");

      this.transfersLayer = this.d3El.append("svg:g")
          .attr("id", "character-transfers");

      Backbone.on('transfer', this.setTransfer, this);

      this.$el.modal({
        show: false
      });
    },

    // Get the width and height of the container element
    //
    // We have to do some hacking since it's initially hidden
    //
    // Based on http://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/
    getHiddenDimensions: function() {
      var $el = this.$containerEl;
      var $hiddenParents = $el.parents().andSelf().not(':visible');
      var props = { position: 'absolute', visibility: 'hidden', display: 'block' };
      var oldProps = [];
      var dims = {};
      var name;

      $hiddenParents.each(function () {
        var old = {};

        for (name in props) {
          old[name] = $el.css(name);
          $el.css(name, props[name]);
        }

        oldProps.push(old);
      });

      dims.width = $el.width();
      dims.height = $el.height();

      $hiddenParents.each(function(i) {
        var old = oldProps[i];

        for (name in props) {
          // For our use case, we can just unset the CSS property rather than
          // restoring the old version
          $el.css(name, '');
        }
      });

      return dims;
    },

    setTransfer: function(date, tracId) {
      var view = this;
      var transfer = this.characterEvents.where({
        tracId: tracId,
        date: date.format("YYYY-MM-DD")
      })[0];
      var fromFacilityId = transfer.get('from_facility');
      var toFacilityId = transfer.get('to_facility');
      var facilities = this.facilities.filterCollection(function(facility) {
        return facility.id === fromFacilityId || facility.id === toFacilityId; 
      });
      var transfers = [[fromFacilityId, toFacilityId]];

      // Defer rendering until the modal is shown
      this.$el.on('shown', function() {
        view.$el.off('shown');
        view.width = view.$containerEl.width();
        view.height = view.$containerEl.height();
        view.projection = view.options.projection()
            .scale(view.options.scale)
            .translate([view.width / 2, view.height / 2]);
        view.d3El.attr("width", view.width)
          .attr("height", view.height);
        view.path = d3.geo.path()
            .projection(view.projection);

        view.renderStates(view.statesLayer, view.states, view.path);
        view.renderFacilities(view.facilitiesLayer, facilities, view.path);
        if (fromFacilityId && toFacilityId) {
          view.renderTransfers(view.transfersLayer, transfers, facilities, view.path, true);
        }
      });
      this.$el.modal('show');
    },

    render: function() {
      return this;
    }
  }));
});
