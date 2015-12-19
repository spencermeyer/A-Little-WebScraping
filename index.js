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

app.get('/scrape', function(req, res){
  // Let's scrape
  
  var options = {
      url : 'http://www.parkrun.org.uk/eastleigh/results/latestresults/',
      headers: {
        'User-Agent': 'request'
      }
    };

  request(options, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      console.log('loaded webpage eastleigh pr');
      var title, release, rating;
      var json = { pos : "", parkrunner : "", time : "", agecat : "", agegrade : "", gender : "", genderpos : "", note : "", totalruns : "" };

  //    $('.sortable').filter(function(){
  //      var data =$(this);
  //      console.log("next should be the data");

      $('table.sortable').each(function(i, element){
              var a = $(this).children().next().children().children();
              console.log(a.text());              // the whole data table written
              json.pos=a.text();                  // writes the entire table into the json.pos(1)
        //console.log(data.text);
      });

      //json.pos = data;

    //  $('.header').filter(function(){
    //        var data = $(this);
    //        title = data.children().first().text();
    //        release = data.children().last().children().text();
    //        json.title = title;
    //        json.release = release;
    //      })

    //      $('.star-box-giga-star').filter(function(){
    //        var data = $(this);
    //        rating = data.text();
    //        json.rating = rating;
    //      })
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


