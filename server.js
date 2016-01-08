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
  });
console.log("hello from scrape2 after loading file");

 res.sendfile('./public/results2.html'); 
});


// this route does the scraping and saves to json
app.get('/scrape', function(req, res){
  // Let's scrape

  //  ****  Lets scrape Eastleigh  ***
  var options = {
    url : 'http://www.parkrun.org.uk/eastleigh/results/latestresults/',
    // url : 'http://localhost:8000/results_Eastleigh_parkrun.html',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){
      var $ = cheerio.load(html);
      console.log('loaded webpage eastleigh pr no errors');
      var json =[];

      $('table.sortable tbody tr').each(function(i, element){ 
        var children = $(this).children();
        children.each(function(){
          if(children.eq(7).text() === "Eastleigh RC"){
            json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };
          }
        }); 
      });
    }
    fs.writeFile('public/output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });
  });
// *** Lets scrape Netley *****
   options.url = 'http://www.parkrun.org.uk/netleyabbey/results/latestresults/';
    // url : 'http://www.parkrun.org.uk/netleyabbey/results/latestresults/',
    // url = 'http://localhost:8000/results_Netley_Abbey_parkrun.html';

    request(options, function(error, response, html){
      if(error){console.log('There was an error', error)};
      if(!error){
        var $ = cheerio.load(html);
        console.log('loaded webpage netley pr no errors');
        var json =[];

        $('table.sortable tbody tr').each(function(i, element){ 
          var children = $(this).children();
          children.each(function(){
            if(children.eq(7).text() === "Eastleigh RC"){
              json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };
            }
          }); 
        });
      }
      fs.writeFile('public/output_n.json', JSON.stringify(json, null, 4), function(err){
        console.log('File_n successfully written! - Check your project directory for the output.json file');
      });
    });

// *** Lets scrape Southampton *****
options.url = 'http://www.parkrun.org.uk/southampton/results/latestresults/';
    // url : 'http://www.parkrun.org.uk/southampton/results/latestresults/',
    // url : 'http://localhost:8000/results_Southampton_parkrun.html',

    request(options, function(error, response, html){
      if(error){console.log('There was an error', error)};
      if(!error){
        var $ = cheerio.load(html);
        console.log('loaded webpage southampton pr no errors');
        var json =[];

        $('table.sortable tbody tr').each(function(i, element){ 
          var children = $(this).children();
          children.each(function(){
            if(children.eq(7).text() === "Eastleigh RC"){
              json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };
            }
          }); 
        });
      }
      fs.writeFile('public/output_s.json', JSON.stringify(json, null, 4), function(err){
        console.log('File_n successfully written! - Check your project directory for the output.json file');
      });
    });

// *** Lets scrape Winchester *****
options.url = 'http://www.parkrun.org.uk/winchester/results/latestresults/';
    // url : 'http://www.parkrun.org.uk/winchester/results/latestresults/',
    // url : 'http://localhost:8000/results_Winchester_parkrun.html',

    request(options, function(error, response, html){
      if(error){console.log('There was an error', error)};
      if(!error){
        var $ = cheerio.load(html);
        console.log('loaded webpage southampton pr no errors');
        var json =[];

        $('table.sortable tbody tr').each(function(i, element){ 
          var children = $(this).children();
          children.each(function(){
            if(children.eq(7).text() === "Eastleigh RC"){
              json[children.eq(0).text()] = { "pos" : children.eq(0).text(), "parkrunner" : children.eq(1).text(), "time": children.eq(2).text(), "agecat" :  children.eq(3).text(), "agegrade" : children.eq(4).text(), "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text() };
            }
          }); 
        });
      }
      fs.writeFile('public/output_w.json', JSON.stringify(json, null, 4), function(err){
        console.log('File_n successfully written! - Check your project directory for the output.json file');
      });
    });


res.sendfile('./public/results.html');
})

// TO DO :
//  http://stackoverflow.com/questions/31358992/application-appname-failed-to-start-port-8080-not-available-on-open-shift-no

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});



// listen (start app with node busController.js)  below is code that worked locally and will work on heroku
// app.listen(process.env.PORT || 5000);
// console.log("App listening on port 5000 or Heroku env port");
// exports = module.exports = app;
