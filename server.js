var express = require('express');
var vhost = require('vhost');

/*
edit /etc/hosts:

127.0.0.1       api.mydomain.local
127.0.0.1       admin.mydomain.local
*/

// require your first app here

var martinv = require("./main.js");

// require your second app here

var sfr = require("./sfr/index.html");

// redirect.use(function(req, res){
//   if (!module.parent) console.log(req.vhost);
//   res.redirect('http://example.com:3000/' + req.vhost[0]);
// });

// Vhost app

var appWithVhost = module.exports = express();

appWithVhost.use(vhost('martinv.io', martinv)); // Serves first app

appWithVhost.use(vhost('summerfoodrocks.io', sfr)); // Serves second app

/* istanbul ignore next */
if (!module.parent) {
  appWithVhost.listen(80);
  console.log('Express started on port 80');
}
