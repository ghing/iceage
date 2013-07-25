define(['backbone', 'models/Character'], function(Backbone, Character) {
  var Characters = Backbone.Collection.extend({
    model: Character,
  
    url: './data/characters.json'
  });

  return Characters;
});

