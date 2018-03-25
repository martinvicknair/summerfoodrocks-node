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
    // this route should find all searches in the table and display them as JSON
    db.Search.findAll({
      order: [
           ['createdAt', 'DESC'],
       ],
    }).then(function(allSearches) {
      res.json(allSearches);
    })
  });

// the following app.get shows only logText
  // app.get('/api/searches', function(req, res){
  //   db.Search.findAll({
  //     }).then(function(allSearches) {
  //           allLogText = [];
  //       for (var i=0; i<allSearches.length; i++){
  //           allLogText.unshift( allSearches[i].logText );
  //       }
  //       res.send( allLogText);
  //     })
  //
  // });

  app.post("/api/searches", function(req, res) {
    // this route should add a new search to the table
    console.log("/api/searches route");
    db.Search.create({
      logText: req.body.logText,
      resultNum: req.body.resultNum,
      queryTerms: req.body.queryTerms,
      queryX: req.body.queryX,
      queryY: req.body.queryY,
      queryZip: req.body.queryZip,
      userNeighborhood: req.body.userNeighborhood,
      userX: req.body.userX,
      userY: req.body.userY,
      userZip: req.body.userZip
    }).then(function(newSearch) {
      console.log("New search completed ");
      // console.log(newSearch);
      // res.redirect("/api/searches")
    });
  });


// we do not wish to allow web users to delete data,
// therefore the following functionality is disabled/commented out
  // app.delete("/api/searches/:id", function(req, res) {
  //   // this route should delete a search from the table, if the id matches the ':id' url param
  //   db.Search.destroy({
  //     where: {
  //       id: req.body.id
  //     }
  //   })
  // });
}
