define([
  'backbone', 
  'moment'
], function(Backbone, moment)  {
  return Backbone.Router.extend({
    routes: {
      "transfers/:date/:tracid": 'transfer'
    },

    transfer: function(date, tracid) {
      Backbone.trigger('transfer', moment(date), tracid);
    }
  });
});
