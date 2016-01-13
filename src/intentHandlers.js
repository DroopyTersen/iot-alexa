var droopyHttp = new (require("droopy-http"))();
var utils = require("./utils");
var urls = require("./urls")
var powerRouter = require("./powerRouter");

var whatToWatch = function(intent, done, url) {
    droopyHttp.getJSON(url, true)
        .then(function (movies) {
            var movie = utils.getRandomItem(movies);
            var speechOutput = ("How about " + movie.title + "?");
            console.log(speechOutput);
            done(speechOutput);
        });
};

var handlers = {
    "TogglePower": function (intent, done) {
        var iotEvent = powerRouter(intent);
        if (iotEvent) {
            utils.iotTrigger(iotEvent, done);
        }
    },
    "TurnUpVolume": function(intent, done) {
        var iotEvent = {
            type: "remote-macro",
            payload: { macro: "turnUp" },
            target: "tonyk"
        };
        utils.iotTrigger(iotEvent, done);
    },
    "TurnDownVolume": function(intent, done) {
        var iotEvent = {
            type: "remote-macro",
            payload: { macro: "turnDown" },
            target: "tonyk"
        };
        utils.iotTrigger(iotEvent, done);
    },
    "RecentMovies": function (intent, done) {
        droopyHttp.getJSON(urls.recentMovies, true)
            .then(function (movies) {
                console.log("Found count: " + movies.length);
                var speechOutput = ("Your newest movies are " + utils.moviesToSpeechString(movies) + ".");
                console.log(speechOutput);
                done(speechOutput);
            });
    },
    "WhatToWatch": function(intent, done) {
        whatToWatch(intent, done, urls.allMovies);
    },
    "WhatToWatchUnwatched": function(intent, done) {
        whatToWatch(intent, done, urls.unwatched);
    },
    "Stats": function (intent, done) {
        droopyHttp.getJSON(urls.stats, true).then(function (stats) {
            var speechOutput = "You have " + stats.totalCount + " movies in your collection. ";
            speechOutput += " There are still " + stats.unwatched + " movies that you haven't seen yet.";
            done(speechOutput);
        });
    },
    "PlayMovie": function (intent, done) {
        var title = utils.getSlot("Title", intent);
        var iotEvent = {
            type: "play-movie",
            payload: { title: title },
            target: utils.getTarget(intent)
            
        };
        utils.iotTrigger(iotEvent, done);
    },
    "PauseMovie": function (intent, done) {
        var iotEvent = {
            type: "pause-movie",
            payload: { },
            target: utils.getTarget(intent)
        };
        utils.iotTrigger(iotEvent, done);
    },
    "UnPauseMovie": function (intent, done) {
        var iotEvent = {
            type: "unpause-movie",
            payload: { },
            target: utils.getTarget(intent)
        };
        utils.iotTrigger(iotEvent, done);
    },
    welcome: function(done) {
        var speechOutput = "Welcome to Sinna Prowl. This is where I can help you watch movies.";
        done(utils.buildSpeech(speechOutput, false));
    }
};

module.exports = handlers;