define(['backbone'], function(Backbone) {
  var Character = Backbone.Model.extend({
    idAttribute: 'trac_id'
  });

  return Character;
});
