var path = require("path");

module.exports = function(app) {
	app.get("/form", function(req, res) {
		// this route should render the Handlebars 'form' template
		res.render("form");
	});
}
