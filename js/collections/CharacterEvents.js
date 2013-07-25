define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.Collection.extend({
    url: './data/character_timelines.json',

    parse: function(response) {
      // Save start and end dates as collection properties
      this.start = moment(response.start_date);
      this.end = moment(response.end_date);

      var data = [];

      _.each(response, function(events, date) {
        _.each(events, function(description, tracId) {
          data.push({
            id: date + '-' + tracId,
            date: date,
            tracId: tracId,
            description: description
          });
        });
      });

      return data;
    },

    get: function(id, date) {
      var realId = id; 
      if (!_.isUndefined(date)) {
        realId = date + '-' + id;
      }

      return Backbone.Collection.prototype.get.apply(this, realId);
    }
  });
});
