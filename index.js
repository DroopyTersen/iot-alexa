var http = require("http");
var req = new (require("droopy-http"))();
var request = require("request");
var baseUrl = "http://api.cineprowl.com";
var iotUrl = "http://iot.droopytersen.us:2000/trigger";

var urls = {
    recentMovies: baseUrl + "/movies?$select=title&$top=10&$orderby=addedToDb desc",
    stats: baseUrl + "/stats"
};

var getRequest = function (url, cb) {
    req.getJSON(url, true).then(cb);
};


exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("RecentMovies" === intentName) {
        getRecentMovies(intent, session, callback);
    } else if ("Stats" === intentName) {
        getTotalCount(intent, session, callback);
    }
    else if ("PlayMovie" === intentName) {
        var title = intent.slots && intent.slots.Title && intent.slots.Title.value ? intent.slots.Title.value : "";
        trigger("play-movie", intent, session, callback, { title: title, intentReq: intentRequest });
    } else if ("PauseMovie" === intentName) {
        trigger("pause-movie", intent, session, callback);
    } else if ("UnPauseMovie" === intentName) {
        trigger("unpause-movie", intent, session, callback);
    }
    else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

function trigger(command, intent, session, callback, payload) {
    var body = {
        key: command,
        target: "thora",
        payload: payload,
        source: "alexa"
    };

    var options = {
        method: 'post',
        body: body,
        json: true,
        url: iotUrl
    };
    // console.log(options);
    request(options, function (error, response, body) {
        if (!error) {
            callback({}, buildSpeechletResponse(intent.name, "As you wish", null, true));
        } else {
            callback({}, buildSpeechletResponse(intent.name, "Wuhh Ohhh", null, true));
        }
    });
};
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Sinna Prowl. This is where I can help you watch movies. " +
        "Please tell me what room you are in.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what room you are in.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

var moviesToSpeechString = function (movies) {
    return movies.map(function (movie) {
        return movie.title;
    }).join(", ");
};

function getTotalCount(intent, session, callback) {
    getRequest(urls.stats, function (stats) {
        var speechOutput = "You have " + stats.totalCount + " movies in your collection. ";
        speechOutput += " There are still " + stats.unwatched + " movies that you haven't seen yet.";
        callback({}, buildSpeechletResponse(intent.name, speechOutput, null, true));
    });
};

function getRecentMovies(intent, session, callback) {
    getRequest(urls.recentMovies, function (movies) {
        var speechOutput = "Your newest movies are " + moviesToSpeechString(movies) + ".";
        callback({}, buildSpeechletResponse(intent.name, speechOutput, null, true));
    });
};


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
