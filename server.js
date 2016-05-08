//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');       // for writing json files
var request  = require('request');  // http get
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
var cheerio  = require('cheerio');  // scrapes the request

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
    //url : 'http://localhost:8000/results_Consolidated_parkrun.html',
    url : 'http://www.parkrun.com/results/consolidatedclub/?clubNum=1537',
    headers: {
      'User-Agent': 'request'
    }
  };
  analsjson=[];
  var time = new Date();
  var year = time.getFullYear();
  var month = time.getMonth()+1;
  var date1 = time.getDate();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  var timeDate= "Time "+  year + "-" + month+"-"+date1+" "+hour+":"+minutes+":"+seconds;
  console.log(timeDate);
  analsjson.push({"TimeAndDate": timeDate, "UserAgent": req.headers['user-agent'], "UserIP":req.headers['x-forwarded-for'] })
  fs.appendFile('public/analytics.json', JSON.stringify(analsjson, null, 4), function (err) {
    console.log("analtics written");
  });

  var linksjson =[];
  // Stage One: Get all the relevant Links:
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

// Stage Two: Scrape the Links for Relevant Data:
var timerFunction0 = setTimeout(function(){
// this route does the scraping and saves to json it is working.
  // Let's scrape
  console.log("from individual scrapes");
  // First clean the output.json
  var json =[];
  agecats = {};
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
  // Here, iterate through each link and extract the data
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
            //  here work out the age gradings.
            agecat=children.eq(3).text()
            if(agecat in agecats){
              agecats[agecat]=agecats[agecat]+1;
            }else{
              agecats[agecat]=1;
            }
            console.log("cs agecat", agecat, agecats[agecat]);
            if(children.eq(7).text() === "Eastleigh RC"){
              json.push({ "parkrun" : $('#primary h2').text(), "pos" : children.eq(0).text(), "parkrunner" :  children.eq(1).text(), "time": children.eq(2).text(), "agecat" : children.eq(3).text(), "agegrade" : children.eq(4).text(), "AgeRank" : agecats[agecat], "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text()});   
            }   
          }); // end of each element in table sortable 
          console.log('here the file is read and json assigned');
          console.log("");
         }
      });
  }
  var timerFunction1 = setTimeout(function(){
    console.log("should be 1 seconds later writing file");
    fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
    console.log("File written! - Check your output.json file");
  },1500);
}, 1500);

console.log("and this is after the subroutine before file send");
var timerFunction2 = setTimeout(function(){
res.sendfile('./public/results.html');
}, 3600);

});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


