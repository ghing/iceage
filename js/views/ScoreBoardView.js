define([
  'backbone', 
  'moment'
], function(Backbone, moment)  {
  return Backbone.View.extend({
    options: {
      humanFormat: "MMMM D, YYYY"
    },

    initialize: function() {
      this.deportations = this.options.deportations;
      this.detentions = this.options.detentions;
      Backbone.on(this.options.dateEvent, this.updateDate, this);
    },

    updateDate: function(date, mDate) {
      this.$('#date').html(mDate.format(this.options.humanFormat));
      this.updateDeportations(date);
      this.updateDetentions(date);
    },

    updateDeportations: function(date) {
      var model = this.deportations.get(date); 
      if (model) {
        this.$('#deportation-count').html(model.get('to_date'));
      }
    },

    updateDetentions: function(date) {
      var model = this.detentions.get(date); 
      if (model) {
        this.$('#detention-count').html(model.get('to_date'));
      }
    }
  });
});
