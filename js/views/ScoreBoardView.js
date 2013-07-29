define([
  'backbone', 
  'moment'
], function(Backbone, moment)  {
  return Backbone.View.extend({
    options: {
      humanFormat: "MMMM D, YYYY"
    },

    events: {
      'click #pause': 'pause',
      'click #resume': 'resume'
    },

    initialize: function() {
      this.deportations = this.options.deportations;
      this.detentions = this.options.detentions;
      Backbone.on(this.options.dateEvent, this.updateDate, this);
      Backbone.once(this.options.dateEvent, this.showPlayControls, this);
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
    },

    pause: function(e) {
      Backbone.trigger('pause');
      this.$('#pause').hide();
      this.$('#resume').show();
      e.preventDefault();
    },

    resume: function(e) {
      Backbone.trigger('play');
      this.$('#resume').hide();
      this.$('#pause').show();
      e.preventDefault();
    },

    showPlayControls: function() {
      this.$('#play-pause').show();
    },
  });
});
