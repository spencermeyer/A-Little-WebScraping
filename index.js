//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');
var request  = require('request');
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
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
//    app.get('/', function(req, res) {
//        res.sendfile('./public/index.html');
//    });

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
})

app.get('/scrape', function(req, res){
  // Let's scrape
  
  var options = {
    // url : 'http://www.parkrun.org.uk/eastleigh/results/latestresults/',
    url : 'http://localhost:5000/public/results_Eastleigh_parkrun',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){
      var $ = cheerio.load(html);
      console.log('loaded webpage eastleigh pr');
      var title, release, rating;
      var json = { pos : "", parkrunner : "", time : "", agecat : "", agegrade : "", gender : "", genderpos : "", note : "", totalruns : "" };

      $('table.sortable tbody tr').each(function(i, element){
        var children = $(this).children();
        children.each(function(){
          console.log ("children are", children.next().text());
          // json.push(children.text());
        });
        // console.log("and json is");  
        //console.log("position", data.slice(0,3));  // this gives back the first 2 characters regardless.  Data here is just a long string
      });

    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
  })
})


// listen (start app with node busController.js)
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000 or Heroku env port");
exports = module.exports = app;


