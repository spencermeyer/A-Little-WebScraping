//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');
var request  = require('request');
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
var cheerio = require('cheerio');

// configuration of controller
app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                 // log every request to the console
app.use(cheerio);                                       // this is the webscraper
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
})

app.get('/scrape', function(req, res){
  // Let's scrape
  
  var options = {
    // url : 'http://www.parkrun.org.uk/eastleigh/results/latestresults/',
    url : 'http://localhost:8000/results_Eastleigh_parkrun.html',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){
      var $ = cheerio.load(html);
      console.log('loaded webpage eastleigh pr no errors');
      var title, release, rating;
      var json =[];

      console.log("going into the table");
      $('table.sortable tbody tr').each(function(i, element){ 
        var children = $(this).children();
        //console.log("this is children ",children);
        children.each(function(){
          //  now need to go throught the 10 child children and extract data *****
          console.log("position ", children.eq(0).text());
          console.log ("runner name ", children.eq(1).text());
          console.log ("time ", children.eq(2).text());
          console.log ("agecat ", children.eq(3).text());
          console.log ("agegrade ", children.eq(4).text());
          console.log ("gender ", children.eq(5).text());
          console.log ("genderpos ", children.eq(6).text());
          console.log ("club ", children.eq(7).text());
          console.log ("Note ", children.eq(8).text());
          console.log ("TotalRuns ", children.eq(9).text());

          if(children.eq(7).text() === "Eastleigh RC"){
            json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };
          }
        }); 
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
