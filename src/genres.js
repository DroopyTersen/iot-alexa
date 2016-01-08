var genres = {
	"Drama": [ "drama", "dramas" ],
	"Thriller": ["thriller", "thrillers" ],
	"Action": [ "action" ],
	"Comedy": ["comedy", "comedies"],
	"Foreign": [ "foreign"],
	"Horror": ["horror"]
};

var findMatch = function(name) {
	name = name.toLowerCase();
	
	var matches = Object.keys(genres).filter(function(genreKey){
		var l = genres[genreKey].length;
		for (var i = 0; i < l; i++) {
			if (genres[genreKey][i] === name) {
				return true;
			}
		}
		return false;
	});
	
	return matches.length ? matches[0] : "";
};

module.exports = {
	keys: genres,
	findMatch: findMatch
};