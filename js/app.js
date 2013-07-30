requirejs.config({
  paths: {
    "text": "./vendor/text",
    "jquery": "./vendor/jquery-1.10.1.min",
    "bootstrap": "./vendor/bootstrap",
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
    'bootstrap': 'jquery',
    'd3': {
      exports: 'd3'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    // For development, prevent browser from caching assets
    // See http://requirejs.org/docs/api.html#config-urlArgs
    urlArgs: "bust=" + Math.random() 
    // For production, use something like
    // urlArgs: "bust=v2"
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
  "views/CharacterTransferView",
  "views/MapView",
  "views/ScoreBoardView",
  "routers/AppRouter",
  "CollectionMonitor"
], function($, Backbone, moment, Characters, CharacterEvents, CharacterStories, Deportations, Detentions, Facilities, States, Transfers, CharacterListView, CharacterStoriesView, CharacterTransferView, MapView, ScoreBoardView, AppRouter, CollectionMonitor) {
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
    var runAnimation = false; // Global flag for running the animation
    var date = null;
    var dateStr = null;

    // Construct the views
    var characterView = new CharacterListView({
      el: $('#characters'),
      collection: characters,
      characterEvents: characterEvents,
      dateEvent: 'change:date'
    });
    var characterTransferView = new CharacterTransferView({
      el: $('#character-transfer-modal'),
      collection: characters,
      characterEvents: characterEvents,
      facilities: facilities,
      states: states
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

    var router = new AppRouter();

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

    // Callback for when the animation has completed
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

      if (runAnimation === false) {
        return;
      }

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
        runAnimation = false;
        animationFinished();
      }
    };

    var updateDate = function(sDate, mDate) {
      date = mDate;
      dateStr = sDate;
    };
    // Keep track of the current date
    Backbone.on('change:date', updateDate);

    var pauseAnimation = function() {
      runAnimation = false;
    };
    Backbone.on('pause', pauseAnimation);

    var playAnimation = function() {
      runAnimation = true;
      animate(transfers, detentions, deportations, date, transfers.end);
    };
    Backbone.on('play', playAnimation);

    // Don't let the user run the animation until all the data
    // has been initialized
    CollectionMonitor.on('ready', function() {
      Backbone.history.start();
      $('#show-animation').click(function() {
        $('#intro').hide();
        $('#app-container').show();
        $('#date').addClass('label');
        runAnimation = true;
        date = transfers.start;
        animate(transfers, detentions, deportations, date, transfers.end);
      });
      $('#show-animation').removeAttr('disabled');
    });
    // Load the collection data
    CollectionMonitor.fetchAll();
  });
});
