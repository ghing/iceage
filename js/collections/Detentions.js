define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.Collection.extend({
    url: './data/detentions_deportations.json',

    parse: function(response) {
      // Save start and end dates as collection properties
      this.start = moment(response.start_date);
      this.end = moment(response.end_date);
      
      return _.map(response.detentions, function(attrs, date) {
        return _.extend(attrs, {
          date: date,
          id: date
        });
      });
    }
  });
});
