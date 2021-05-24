var path = require("path");

module.exports = function(app) {

	app.get("/", function(req, res) {
    	res.render("index" );
	});

	app.get("/mealcounter", function(req, res) {
		res.render("mealcounter" );
	});

	app.get("/resources", function(req, res) {
		res.render("resources" );
	});

	app.get("/sitefinder", function(req, res) {
		res.render("index" );
	});

	// app.get("/*", function(req, res) {
	// 	res.render("index" );
	// });

}
