var utils = require("./utils");

var turnOnRelay = function(relayName) {
	return {
		"type": "relay",
		"target": "brain",
		"payload": {
			"relay": relayName,
			"command": "turnOn"
		}
	}
};

var items = {
	"tv": {
		type: "remote-macro",
		payload: {
			macro: "togglePower"
		},
		target: "tonyk"
	},
	"corner light": turnOnRelay("cornerLight"),
	"fish tank": turnOnRelay("fishTank")
};

var route = function(intent) {
	var itemKey = utils.getSlot("Item", intent).toLowerCase();
	var event = items[itemKey];

	var state = utils.getSlot("State", intent).toLowerCase();
	if (event && event.payload.command && state === "off") {
		event.payload.command = "turnOff";

	}
	event.payload.intent = intent;
	event.payload.state = state;
	return event && state ? event : null;
}

module.exports = route;