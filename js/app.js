requirejs.config({
  paths: {
    "text": "./vendor/text",
    "jquery": "./vendor/jquery-1.10.1.min",
    //"bootstrap": "./vendor/js/bootstrap",
    "handlebars": "./vendor/handlebars",
    "d3": "./vendor/d3.v3.min",
    "moment": "./vendor/moment.min",
    "backbone": "./vendor/backbone",
    "underscore": "./vendor/underscore"
  },
  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
    //'bootstrap': 'jquery',
    'd3': {
      exports: 'd3'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    }
  }
});

require([
  "jquery", 
  "backbone",
  "moment", 
  "collections/Characters",
  "collections/CharacterEvents",
  "collections/CharacterStories",
  "collections/Deportations",
  "collections/Detentions",
  "collections/Facilities",
  "collections/States",
  "collections/Transfers",
  "views/CharacterListView",
  "views/CharacterStoriesView",
  "views/MapView",
  "views/ScoreBoardView",
  "CollectionMonitor"
], function($, Backbone, moment, Characters, CharacterEvents, CharacterStories, Deportations, Detentions, Facilities, States, Transfers, CharacterListView, CharacterStoriesView, MapView, ScoreBoardView, CollectionMonitor) {
  $(function() {
    // Construct the collections
    var characters = new Characters();
    var characterEvents = new CharacterEvents();
    var characterStories = new CharacterStories();
    var detentions = new Detentions();
    var deportations = new Deportations();
    var facilities = new Facilities();
    var transfers = new Transfers();
    var states = new States();

    // Construct the views
    var characterView = new CharacterListView({
      el: $('#characters'),
      collection: characters,
      characterEvents: characterEvents,
      dateEvent: 'change:date'
    });
    var mapView = new MapView({
      el: $('#map-container'),
      deportations: deportations,
      detentions: detentions,
      facilities: facilities,
      states: states,
      transfers: transfers,
      dateEvent: 'change:date'
    });
    var characterStoriesView = new CharacterStoriesView({
      el: $('#character-stories'),
      collection: characterStories,
      dateEvent: 'change:date'
    });
    var scoreBoardView = new ScoreBoardView({
      el: $('#scoreboard'),
      deportations: deportations,
      detentions: detentions,
      dateEvent: 'change:date'
    });

    // Load the collection data
    CollectionMonitor.register({
      'characters': characters,
      'characterEvents': characterEvents,
      'characterStories': characterStories,
      'deportations': deportations,
      'detentions': detentions,
      'states': states,
      'facilities': facilities,
      'transfers': transfers
    });

    var animationFinished = function() {
      characterView.addStoryLinks();
      $('#narrative').show();
      characterStoriesView.$el.show();
      $('#learn-more-button').show();
    };

    var animate = function(transfers, detentions, deportations, date, endDate) {
      var isoFormat = "YYYY-MM-DD";
      var nextDate = date.clone().add(1, 'd'); 
      var dStr = date.format(isoFormat);
      var ndStr = nextDate.format(isoFormat);

      Backbone.trigger('change:date', dStr, date);

      if (nextDate <= endDate) {
        if (transfers.get(ndStr) || detentions.get(ndStr) || deportations.get(ndStr)) {
          setTimeout(function() {
            animate(transfers, detentions, deportations, nextDate, endDate);
          }, 300);
        }
        else {
          animate(transfers, detentions, deportations, nextDate, endDate);
        }
      }
      else {
        animationFinished();
      }
    };

    // Don't let the user run the animation until all the data
    // has been initialized
    CollectionMonitor.on('ready', function() {
      $('#show-animation').click(function() {
        $('#intro').hide();
        $('#app-container').show();
        $('#date').addClass('label');
        animate(transfers, detentions, deportations, transfers.start, transfers.end);
      });
      $('#show-animation').removeAttr('disabled');
    });
    // Load the collection data
    CollectionMonitor.fetchAll();
  });
});
