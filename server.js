//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');
var request  = require('request');
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
var cheerio  = require('cheerio');

// configuration of controller
app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                 // log every request to the console
app.use(cheerio);                                       // this is the webscraper

// to do:
// refactor /scrape code below so there is only one scraping routine, the code is too WET

// configure routes
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

app.get('/results2', function(req, res){
  res.sendfile('./public/results2.html');
});

app.get('/results', function(req, res){
  res.sendfile('./public/results.html');
});

// this route scrapes the consolodated site and makes a json of the sources
app.get('/scrape2', function(req, res){
  var options = {
    url : 'http://localhost:8000/results_Consolidated_parkrun.html',
    // url : 'http://www.parkrun.com/results/consolidatedclub/?clubNum=1537',
    headers: {
      'User-Agent': 'request'
    }
  };
  console.log("hello from scrape 2");
  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){console.log('not an error!')}
      console.log("something from the request to consolidated");
    var json =[];
    var $ = cheerio.load(html);
    console.log('loaded webpage consolodated no errors');
    $('.floatleft a').not('.sortable').each(function(i, element){
      test=element.attribs.href;
      if(test.indexOf("weekly")!=-1){
        console.log("one element but how many?", test, i);
        json.push({"website": test});
      }
    });
    // now the json has the links to each parkrun, write the file
    fs.writeFile('public/links.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the links.json file');
    });

    console.log('after the selection');
  });

  console.log("hello from scrape2 after loading file");

  res.sendfile('./public/results2.html'); 
});


// this route does the scraping and saves to json
app.get('/scrape', function(req, res){
  // Let's scrape

  var sitesLocal = [
  { "website" : 'http://localhost:8000/results_Eastleigh_parkrun.html'},
  { "website" : 'http://localhost:8000/results_Netley_Abbey_parkrun.html'},
  { "website" : 'http://localhost:8000/results_Southampton_parkrun.html'},
  { "website" : 'http://localhost:8000/results_Winchester_parkrun.html'}
  ]

//  ****  Lets scrape all
// First clean the output.json
fs.writeFile('public/output.json', JSON.stringify(json, null, 4), function(err){  
  console.log('Output.json is cleaned');  
});

// PLAN : 
// 1) test this loop and debug,
// 2) make it append to json not separate files  OR make a deeper JSON object 
//  like this   { 1:{stuff from one website}, 2:{stuff from another}  }
// 3) add a reference to the parkrun location and date into json  scrape h2


// now go through all the websites where there are results:
  for (var i=0, len=sitesLocal.length; i<len; i++){
    console.log('scraping:',sitesLocal[i].website);  
    var options = {
      // url : 'http://www.parkrun.org.uk/eastleigh/results/latestresults/',
      url : sitesLocal[i].website,
      headers: {
        'User-Agent': 'request'
      }
    };
      request(options, function(error, response, html){
        if(error){console.log('There was an error', error)};
        if(!error){
          var $ = cheerio.load(html);
          console.log('loaded webpage',sitesLocal[i], 'pr no errors');
          var json =[];
  
          $('table.sortable tbody tr').each(function(i, element){ 
            var children = $(this).children();
            children.each(function(){
              if(children.eq(7).text() === "Eastleigh RC"){
                json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "  time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text() , "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };  
            } 
          });    
        }); 
      } 
      fs.writeFile('public/output.json', JSON.stringify(json, null, 4), function(err){  
        console.log('File successfully written! - Check your project directory for the output.json file');  
      });
    });
  }





res.sendfile('./public/results.html');
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


