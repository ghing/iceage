define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.Collection.extend({
    url: './data/us-states.json',

    parse: function(response) {
      // The elements we're interested in are in the 'features' propery
      // Also filter out Hawaii and Alaska
      return _.filter(response.features, function(state) {
        if (state.properties.name === "Hawaii" || state.properties.name === "Alaska") {
          return false;
        }
        else {
          return true;
        }
      });
    }
  });
});
