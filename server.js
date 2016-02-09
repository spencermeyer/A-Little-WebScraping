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

// OK HERE'S THE CALLBACK IDEA:
//
//  getLinks(URL, scrapeAndWrite);
//  
//  function getLinks(indexURL, callback){
//    listOfLinks=blah blah blah;
//    callback(listOfLinks);    
//  }
//
//  function scrapeAndWrite(linksForScraping) {
//    scrape all of linksForScraping;
//    write to file;      **POTENTIAL PROB NEED ANOTHER CALLBACK?
// }
//
//



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
  request(options, function(error, response, html){
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
    fs.writeFile('public/links.json', JSON.stringify(linksjson, null, 4), function(err){
      console.log('File links.json successfully written! - Check your project directory for the links.json file');
    });
  });  // end of the request routine

var timerFunction0 = setTimeout(function(){
// going to try 500 ms timeout of this first time function
  // Let's scrape
  console.log("from individual scrapes");
  // First clean the output.json
  var json =[];
  fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
  console.log("json cleaned / created");
  
// now go through all the websites where there are results:
var options = {
      url : linksjson[0].website,
      headers: {
        'User-Agent': 'request'
      }
    };
    console.log('after set options');

  // THIS IS THE LOOP
  for(website in linksjson)
  { 
    options.url = linksjson[website].website;
      request(options, function(error, response, html){
        if(error){console.log('There was an error', error)};
        if(!error){
          console.log("no error, scraping");
          var $ = cheerio.load(html);
          //Here, pick out the data and assign json
          $('table.sortable tbody tr').each(function(i, element){ 
            var children = $(this).children();
            if(children.eq(7).text() === "Eastleigh RC"){
              json.push({ "parkrun" : $('#primary h2').text(), "pos" : children.eq(0).text(), "parkrunner" :  children.eq(1).text(), "time": children.eq(2).text(), "agecat" : children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text()});   
            }   
          }); // end of each element in table sortable 
          console.log('here the file is read and json assigned');
          console.log("");
         }
      });
  }

var timerFunction = setTimeout(function(){
  console.log("should be 1 seconds later writing file");
  fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
  console.log("File written! - Check your output.json file");
},1000);
      
//try end of first timout here
}, 1500);

console.log("and this is after the subroutine before file send");
res.sendfile('./public/results.html');
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


