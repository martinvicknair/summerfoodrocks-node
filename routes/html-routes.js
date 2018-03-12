var path = require("path");

module.exports = function(app) {
	app.get("/", function(req, res) {
		// this route should render the Handlebars 'form' template
    res.render("index" );
	});

	app.get("summerfoodrocks.io/", function(req, res) {
		// this route should render the Handlebars 'form' template
		console.log("sfr");
	});
}
