define([
  'backbone', 
  'handlebars',
  'text!templates/characters.html'
], function(Backbone, Handlebars, templateSource)  {
  return Backbone.View.extend({
    initialize: function() {
      this.template = Handlebars.compile(templateSource);
      this.characterEvents = this.options.characterEvents;
      this.collection.on('sync', function() {
        this.render();
      }, this);
      Backbone.on(this.options.dateEvent, this.updateDate, this);
    },

    updateDate: function(date, mDate) {
      var events = this.characterEvents.where({
        date: date
      });
      _.each(events, function(model) {
        var message = mDate.format("MMMM D, YYYY") + ": " + model.get('description');
        this.$('#' + model.get('tracId') + " .status").html(message);
      }, this);
    },

    addStoryLinks: function() {
      this.$(".character").each(function() {
        var id = $(this).data('trac-id');
        $(this).find('.status').append(" <a href='#character-stories-" + id + "'>Read their story</a>");
      });
      return this;
    },

    render: function() {
      this.$el.html(this.template({
        characters: this.collection.toJSON()
      }));
      return this;
    }
  });
});
