var path = require("path");

module.exports = function(app) {
	app.get("/", function(req, res) {
    res.render("index" );
	});

	app.get("/americorps", function(req, res) {
    res.render("americorps" );
	});
}
