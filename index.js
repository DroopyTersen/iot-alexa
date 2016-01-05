var intentHandlers = require("./src/intentHandlers");
var utils = require("./src/utils");

exports.handler = function (event, context) {
    
    // 'result' can be string or utils.buildSpeech
    var done = function(result) {
        console.log("made it to done handler");
        var response = utils.buildResponse(result);
        context.succeed(response);
    };
    
    try {
        if (event.request.type === "LaunchRequest") {
            intentHandlers.welcome(done);
        } 
        else if (event.request.type === "IntentRequest") {
            console.log("New Intent Request");
            var intent = event.request.intent;
            if (intentHandlers[intent.name]) {
                console.log("Found Intent Handler");
                intentHandlers[intent.name](intent, done);
            }
        } 
        else if (event.request.type === "SessionEndedRequest") {
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};
