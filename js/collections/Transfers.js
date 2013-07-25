define([
  'underscore',
  'backbone',
  'moment'
], function(_, Backbone, moment) {
  return Backbone.Collection.extend({
    url: './data/transfers.json',

    parse: function(response) {
      // Save start and end dates as collection properties
      this.start = moment(response.start_date);
      this.end = moment(response.end_date);

      // Transfers are a dictionary of dates mapping to a list
      // of facility to facility pairs
      return _.map(response.transfers, function(transfers, date) {
        return {
          date: date,
          id: date,
          transfers: transfers
        };
      });
    }
  });
});
