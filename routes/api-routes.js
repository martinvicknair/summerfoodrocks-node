var db = require("../models");

module.exports = function(app) {
  // app.get("/", function(req, res) {
  //   // this route should find all contacts in the table and render them using the Handlebars 'contacts' template, sorted ascending by firstName
  //   console.log("root route");
	// 	db.Contact.findAll({
	// 		order: [['firstName', 'ASC'], ['lastName', 'ASC']],
	// 	}).then(function(allContacts) {
  //     res.render('contacts', {name: "Joe", contacts: allContacts});
  //   })
  //
  // });

  app.get("/api/searches", function(req, res) {
    // this route should find all contacts in the table and display them as JSON
    db.Search.findAll({}).then(function(allSearches) {
      res.json(allSearches);
    })
  });

  app.post("/api/searches", function(req, res) {
    // this route should add a new contact to the table, and should then redirect to the route '/api/contacts'
    console.log("/api/searches route");
    db.Search.create({
      numResults: req.body.numResults,
      logText: req.body.logText,
      searchTerms: req.body.searchTerms,
      searchX: req.body.searchX,
      searchY: req.body.searchY,
      userNeighborhood: req.body.userNeighborhood,
      userX: req.body.userX,
      userY: req.body.userY
    }).then(function(newSearch) {
      console.log("New search: ");
      console.log(newSearch);
      res.redirect("/api/searches")
    });
  });

  app.delete("/api/contacts/:id", function(req, res) {
    // this route should delete a contact from the table, if the id matches the ':id' url param
    db.Contact.destroy({
      where: {
        id: req.body.id
      }
    })
  });
}
