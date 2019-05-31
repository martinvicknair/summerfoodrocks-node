var path = require("path");

module.exports = function(app) {
	app.get("/", function(req, res) {
    res.render("index" );
	});

	app.get("/sitefinder", function(req, res) {
		res.render("sitefinder" );
	});

	app.get("/mealcounter*", function(req, res) {
		res.render("mealcounter" );
	});

	app.get("/*", function(req, res) {
		res.render("index" );
	});

}
