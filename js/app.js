requirejs.config({
  paths: {
    "jquery": "./vendor/jquery-1.10.1.min",
    //"bootstrap": "./vendor/js/bootstrap",
    "handlebars": "./vendor/handlebars",
    "d3": "./vendor/d3.v3.min",
    "moment": "./vendor/moment.min"
  },
  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
    //'bootstrap': 'jquery',
    'd3': {
      exports: 'd3'
    }
  }
});

require(["jquery", "d3", "moment", "handlebars"], function($, d3, moment, Handlebars) {
  $(function() {
    var characterTpl = Handlebars.compile($("#characters-template").html());
    var elSel = '#app-container';
    var mapSel = '#map-container';
    var width = $(mapSel).width();
    var height = $(window).height();
    var scale = 1200;
    var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(mapSel).insert("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var states = svg.append("svg:g")
        .attr("id", "states");

    var facilityCircles = svg.append("svg:g")
        .attr("id", "facilities");

    var transferLines = svg.append("svg:g")
        .attr("id", "transfers");

    // From http://stackoverflow.com/a/2919363/386210
    var nl2br = function(str, is_xhtml) {   
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    };

    var initCharacterStories = function(data) {
      var template = Handlebars.compile($('#story-template').html());
      var characterStories = {};
      $.each(data, function(idx, story) {
        var id = story.trac_id;
        if (!characterStories[id]) {
          characterStories[id] = [];
        }
        characterStories[id].push(story);
      });
      $.each(characterStories, function(id, storyList) {
        $.each(storyList, function(idx, story) {
          story.content = nl2br(story.content);
        });
        var context = {
          id: id,
          stories: storyList
        };
        $('#character-stories').append(template(context));
      });
    };

    // TODO: Load the character stories directly from Google Spreadsheets
    d3.csv("data/character_stories.csv", initCharacterStories); 

    var animationFinished = function() {
      $("#characters .character").each(function() {
        var id = $(this).data('trac-id');
        $(this).find('.status').append(" <a href='#character-stories-" + id + "'>Read their story</a>");
      });
      $('#narrative').show();
      $('#character-stories').show();
      $('#learn-more-button').show();
    };

    d3.json("data/characters.json", function(characters) {
      var context = {
        characters: characters
      };
      $('#characters').html(characterTpl(context));
    });

    d3.json("data/us-states.json", function(collection) {
      // Filter out Alaska and Hawaii
      var features = collection.features.filter(function(state) {
        if (state.properties.name === "Hawaii" || state.properties.name === "Alaska") {
          return false;
        }
        else {
          return true;
        }
      });
      states.selectAll("path")
            .data(features)
            .enter().append("svg:path")
            .attr("d", path);
    });

    d3.json("data/facilities.json", function(facilities) {
      var positions = [];
      var positionsByFacilityId = {};
      var pointSize = 5;
      facilities.forEach(function(facility) {
        var loc = [facility.longitude, facility.latitude];
        var pos = projection(loc);
        positions.push(pos);
        positionsByFacilityId[facility.id] = pos; 
      });
      facilityCircles.selectAll("circle")
                     .data(facilities, function(d) { return d.id; })
                     .enter().append("svg:circle")
                     .attr("data-facility-id", function(d, i) { return d.id; })
                     .attr("cx", function(d, i) { return positionsByFacilityId[d.id][0]; })
                     .attr("cy", function(d, i) { return positionsByFacilityId[d.id][1]; })
                     .attr("r", function(d, i) { return pointSize; });


      var drawTransfers = function(transfers) {
        var lines =  transferLines.selectAll("line")
                     .data(transfers, function(d) { return d; });

        lines.enter().append("svg:line")
                     .attr("x1", function(d, i) { return positionsByFacilityId[d[0]][0];})
                     .attr("y1", function(d, i) { return positionsByFacilityId[d[0]][1];})
                     .attr("x2", function(d, i) { return positionsByFacilityId[d[1]][0];})
                     .attr("y2", function(d, i) { return positionsByFacilityId[d[1]][1];})
                     .attr("stroke-width", 1)
                     .attr("stroke", "blue");
        // Commented out, so we can show all the connections
        //lines.exit().remove();
      };

      var updateDetentions = function(data) {
        if (data) {
          d3.select('#detention-count').html(data.to_date);
        }
      };

      var updateDeportations = function(data) {
        if (data) {
          d3.select('#deportation-count').html(data.to_date);
        }
      };

      var updateFacilityMarkers = function(detentions, deportations) {
        facilityCircles.selectAll('circle')
                       .attr("fill", function(d) {
                         if (detentions && $.inArray(d.id, detentions.facilities) !== -1) {
                           return "yellow";
                         }
                         else if (deportations && $.inArray(d.id, deportations.facilities) !== -1) {
                           return "red";
                         }
                         else {
                           return "black";
                         }
                       });
      };

      var updateCharacters = function(timelines, date) {
        $.each(timelines, function(id, reason) {
          var message = date.format("MMMM D, YYYY") + ": " + reason;
          var $el = $("#characters #" + id + " .status").html(message);
        });
      };


      var animate = function(transfers, detentions, deportations, timelines, date, endDate) {
        var isoFormat = "YYYY-MM-DD";
        var humanFormat = "MMMM D, YYYY";
        var nextDate = date.clone().add(1, 'd'); 
        var dStr = date.format(isoFormat);
        var ndStr = nextDate.format(isoFormat);
        var data = [];

        if (transfers[dStr]) {
          data = transfers[dStr];
        }
        d3.select("#date").html(date.format(humanFormat));
        drawTransfers(data);
        updateDetentions(detentions[dStr]);
        updateDeportations(deportations[dStr]);
        updateFacilityMarkers(detentions[dStr], deportations[dStr]);
        if (timelines[dStr]) {
          updateCharacters(timelines[dStr], date);
        }

        if (nextDate <= endDate) {
          if (transfers[ndStr] || detentions[ndStr] || deportations[ndStr]) {
            setTimeout(function() {
              animate(transfers, detentions, deportations, timelines, nextDate, endDate);
            }, 300);
          }
          else {
            animate(transfers, detentions, deportations, timelines, nextDate, endDate);
          }
        }
        else {
          animationFinished();
        }
      };

      d3.json("data/transfers.json", function(transferData) {
        var start = moment(transferData.start_date);
        var end = moment(transferData.end_date);
        var transfers = transferData.transfers;

        d3.json("data/detentions_deportations.json", function(detentionDeportationData) {
          d3.json("data/character_timelines.json", function(timelineData) {
            $('#show-animation').click(function() {
              $('#intro').hide();
              $('#app-container').show();
              $('#date').addClass('label');
              animate(transfers, detentionDeportationData.detentions, detentionDeportationData.deportations, timelineData, start, end);
            });
            $('#show-animation').removeAttr('disabled');
          });
        });
      });
    });
  });
});
