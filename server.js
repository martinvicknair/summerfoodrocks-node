// Dependencies
// =============================================================
// require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// var PORT = PORT || 3000;

var port = normalizePort(process.env.PORT || '3000');
app.listen(port, function() {
  console.log(`App running on port ${port}`);
}

// copy over normalizePort function from bin/www

// Requiring our models directory for syncing
var db = require("./models");

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

// app.listen(PORT, function() {
//   console.log("App listening on port:" + PORT);
// });

// app.listen(PORT, '0.0.0.0');


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on" + PORT);
  });
});
