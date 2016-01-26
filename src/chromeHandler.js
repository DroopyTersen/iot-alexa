var utils = require("./utils");

var launch = function(intent) {
	var website = getWebsite(intent);
	return {
		type: "launch-chrome",
		target: "thora",
		payload: {
			command: website
		}
	};
};

var getWebsite = function(intent) {
	var website = utils.getSlot("Website", intent).toLowerCase();
	if (website === "I.M.D.B.") {
		website = "imdb";
	}
	return website;
}
var search = function(intent) {
	var website = getWebsite(intent);
	var search = utils.getSlot("Search", intent);
	return {
		type: "launch-chrome",
		target: "thora",
		payload: {
			command: website + "Search",
			param: search
		}
	};
}

module.exports = {
	search: search,
	launch: launch
};