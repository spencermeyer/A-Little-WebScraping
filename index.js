//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var app      = express();                // create our app w/ express
var morgan = require('morgan');          // log requests to the console (express4)
// var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
//var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cheerio = require('cheerio');

// configuration of controller
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(cheerio);
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());

// Specify application home page
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var parkdom = cheerio.load('<html><head></head><body><div id="content"><div id="sidebar"></div><div id="main"><div id="breadcrumbs"></div><table id="data"><tr><th>Name</th><th>Address</th></tr><tr><td class="name">John</td><td class="address">Address of John</td></tr><tr><td class="name">Susan</td><td class="address">Address of Susan</td></tr></table></div></div></body></html>');


// listen (start app with node busController.js)
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000 or Heroku env port");