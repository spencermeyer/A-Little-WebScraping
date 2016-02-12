//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');
var request  = require('request');
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
var cheerio  = require('cheerio');

// configuration of controller
app.use(express.static(__dirname + '/public'));   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                           // log every request to the console
app.use(cheerio);                                 // this is the webscraper

// configure routes
app.get('/', function(req, res){
  console.log("home route");
  res.sendfile('./public/index.html');
});

app.get('/results', function(req, res){
  res.sendfile('./public/results.html');
});

// this route scrapes, makes a json and sends the results view
app.get('/scrape', function(req, res){
  var options = {
    url : 'http://localhost:8000/results_Consolidated_parkrun.html',
    // url : 'http://www.parkrun.com/results/consolidatedclub/?clubNum=1537',
    headers: {
      'User-Agent': 'request'
    }
  };
  var linksjson =[];


  getLinks(options, writeLinks);

  function getLinks(linksSources, returnLinks){
    request(linksSources, function(error, response, html){
     if(error){console.log('There was an error', error)};
     if(!error){console.log('not an error!')}
      console.log("something from the request to consolidated");
      var $ = cheerio.load(html);
      console.log('loaded webpage consolodated no errors');
      $('.floatleft a').not('.sortable').each(function(i, element){
        test=element.attribs.href;
        if(test.indexOf("weekly")!=-1){
         console.log("linksjson push this:", test, i);
         linksjson.push({"website": test});
        }
      });
      // now the linksjson has the links to each parkrun, write the file
      returnLinks(linksjson);
    });  // end of the request routine
  }
  // ********************* 

  function writeLinks(listOfLinks){
    fs.writeFile('public/links.json', JSON.stringify(listOfLinks, null, 4), function(err){
          console.log('File links.json successfully written!');
        });
  }


console.log("and this is after all the stuff before the view file send");
res.sendfile('./public/results.html');
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


