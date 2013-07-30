define([
  'backbone', 
  'handlebars',
  'text!templates/characters.html',
  'text!templates/character_status.html'
], function(Backbone, Handlebars, templateSource, statusTemplateSource)  {
  return Backbone.View.extend({
    initialize: function() {
      this.template = Handlebars.compile(templateSource);
      this.statusTemplate = Handlebars.compile(statusTemplateSource);
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
        var context = {
          date: mDate.format("YYYY-MM-DD"),
          humanDate: mDate.format("MMMM D, YYYY"),
          description: model.get('description'),
          tracId: model.get('tracId')
        };
        this.$('#' + model.get('tracId') + " .status")
            .html(this.statusTemplate(context));
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
