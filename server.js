// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models directory for syncing
// var db = require("./models");

// Sets up the Express app to handle data parsing (needed for posts and puts)
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// Set up Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
// require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Hello World! Node.js is working correctly.\n');
}).app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');

// app.listen(PORT, function() {
//   console.log("App listening on http://localhost:" + PORT);
// });

// Syncing our sequelize models and then starting our Express app
// =============================================================
// db.sequelize.sync({}).then(function() {
//   app.listen(PORT, function() {
//     console.log("App listening on http://localhost:" + PORT);
//   });
// });
