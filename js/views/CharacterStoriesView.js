define([
  'underscore',
  'backbone', 
  'handlebars', 
  'text!templates/character_stories.html'
], function(_, Backbone, Handlebars, templateSource) {
  return Backbone.View.extend({
    _initCharacterStories: function() {
      this._characterStories = {};
      _.each(this.collection.groupBy('tracId'), function(models, tracId) {
        this._characterStories[tracId] = _.map(models, function(model) {
          return model.toJSON();
        });
      }, this);
    },

    initialize: function() {
      this.template = Handlebars.compile(templateSource);
      this.collection.on('sync', function() {
        this._initCharacterStories();
        this.render();
      }, this);
    },

    render: function() {
      _.each(this._characterStories, function(storyList, id) {
        var context = {
          id: id,
          stories: storyList
        };
        this.$el.append(this.template(context));
      }, this);
      return this;
    }
  });
});
