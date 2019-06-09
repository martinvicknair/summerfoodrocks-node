var db = require("../models");
const Twitter = require("twitter");
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = function(app) {

  // app.get("/api/searches", function(req, res) {
  //   // this route should find all searches in the table and display them as JSON
  //   db.Search.findAll({
  //     order: [
  //          ['createdAt', 'DESC'],
  //      ],
  //   }).then(function(allSearches) {
  //     res.json(allSearches);
  //   })
  // });

// the following app.get shows only logText
  app.get('/api/searches', function(req, res){
    db.Search.findAll({
      }).then(function(allSearches) {
            allLogText = [];
        for (var i=0; i<allSearches.length; i++){
            allLogText.unshift( allSearches[i].logText );
        }
        res.send( allLogText);
      })
  
  });

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
      userX: req.body.userX,
      userY: req.body.userY,
      userZip: req.body.userZip
    }).then(function(newSearch) {
      console.log("New search completed ");
      // console.log(newSearch);
      // res.redirect("/api/searches")

      client.post('statuses/update', {status: '#SFSP #SummerMeals' + '\n' + '\n' + req.body.logText + '\n' + '\n'  + 'Find Free Summer Meals nearest you: https://SummerFoodRocks.org/sitefinder'}, function(error, tweet, response) {
        if (!error) {
          // console.log(tweet);
        }
      });

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
