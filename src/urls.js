var apiUrl = "http://api.cineprowl.com";

var urls = {
    iot: "http://iot.droopytersen.us:2000/trigger",
    recentMovies: apiUrl + "/movies?$select=title&$top=10&$orderby=addedToDb desc",
    stats: apiUrl + "/stats",
    unwatched: apiUrl + "/movies?$select=title&$top=1000&$orderby=addedToDb desc&$filter=watched eq false",
    getGenre: function(genre) {
        var odata = "?$select=title,rating&$orderby=addedToDb desc&$filter=watched eq false";
        return apiUrl + "/genres/" + genre + odata;
    }
};

urls.cineprowlApi = apiUrl;
module.exports = urls;
