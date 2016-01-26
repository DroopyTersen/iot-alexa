var utils = require("./utils");

var inputs = {
	"tv": "sat",
	"cable": "sat",
	"pc": "dvd",
	"computer": "dvd"
};

var map = function(intent) {
	var inputKey = utils.getSlot("Input", intent).toLowerCase();
	if (inputs[inputKey]) {
		return {
			type: "remote-command",
			target: "tonyk",
			payload: {
				button: inputs[inputKey],
				remote: "soundbar"
			}
		}
	} 
	return null;
}

module.exports = map;