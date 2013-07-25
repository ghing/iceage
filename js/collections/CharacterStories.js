define([
  'underscore',
  'backbone',
  'moment'
], function(_, Backbone, moment) {
  return Backbone.Collection.extend({
    url: "https://spreadsheets.google.com/feeds/list/0AvaXS4x_XvJmdFduOE83OXVSaUhsY2RtTHlEeTVLSnc/1/public/values?alt=json",

    // From http://stackoverflow.com/a/2919363/386210
    nl2br: function(str, is_xhtml) {
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    },

    parse: function(response) {
      return _.map(response.feed.entry, function(entry) {
        var date = moment(entry.gsx$date.$t).format("YYYY-MM-DD");
        return {
          id: date + '-' + entry.gsx$tracid.$t,
          tracId: entry.gsx$tracid.$t,
          date: date,
          content: this.nl2br(entry.gsx$content.$t)
        };
      }, this);
    }
  });
});
