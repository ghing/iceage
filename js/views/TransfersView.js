define([
  'underscore',
  'backbone',
  'd3',
  'views/TransferViewMixin'
], function(_, Backbone, d3, TransferViewMixin) {
  return Backbone.View.extend(_.extend({}, TransferViewMixin, {
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
      var transferFeatures;

      if (transfers) {
        transfers = transfers.get('transfers');
        this.renderTransfers(this.d3El, transfers, this.facilities, this.options.path);
      }
      return this;
    }
  }));
});
