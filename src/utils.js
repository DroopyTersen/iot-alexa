var urls = require("./urls");
var request = require("request");
var rooms = require("./rooms");
var confirmations = require("./confirmations");
var utils = {};

utils.buildSpeech = function(speechText, shouldEndSession) {
    console.log("Building speech: " + speechText);
    if (shouldEndSession !== false) shouldEndSession = true;
    return {
        outputSpeech: {
            type: "PlainText",
            text: speechText
        },
        shouldEndSession: shouldEndSession
    };
};

utils.buildResponse = function(speechResponse) {
    console.log("Building response");
    if (typeof speechResponse === "string") {
        speechResponse = utils.buildSpeech(speechResponse);
    }
    return {
        version: "1.0",
        sessionAttributes: {},
        response: speechResponse
    };
};

utils.getRandomIndex = function(array) {
    return Math.floor(Math.random() * array.length)
}
utils.getRandomItem = function(array) {
    return array[ utils.getRandomIndex(array) ];
};

utils.getTarget = function(intent, defaultTarget) {
    var room = utils.getSlot("Room", intent) || "living room";
    return rooms[room] || defaultTarget || "thora";
};

utils.getSlot = function(key, intent) {
    return intent.slots && intent.slots[key] && intent.slots[key].value ? intent.slots[key].value : "";
};

utils.moviesToSpeechString = function (movies) {
    console.log("movies to speech string");
    return movies.map(function (movie) { return movie.title; }).join(", ");
};

utils.iotTrigger = function(iotEvent, done) {
    iotEvent.source = "alexa";

    var options = {
        method: 'post',
        body: iotEvent,
        json: true,
        url: urls.iot
    };
    
    request(options, function(err) {
        var speechText = !err ? utils.getRandomItem(confirmations) : "Uh oh!";
        done(speechText);
    });
};

module.exports = utils;