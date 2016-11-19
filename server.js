//  Webscrape Demo by Spencer M.

// Build a controller
var express  = require('express');
var fs       = require('fs');       // for writing json files
var request  = require('request');  // http get
var app      = express();           // create our app w/ express
var morgan   = require('morgan');   // log requests to the console (express4)
var cheerio  = require('cheerio');  // scrapes the request
var helmet   = require('helmet');   // does security stuff

// configuration of controller
app.use(express.static(__dirname + '/public'));   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                           // log every request to the console
app.use(cheerio);                                 // this is the webscraper
app.use(helmet());                                // security type stuff

// configure routes
app.get('/', function(req, res){
  doAnalytics("Home", req);
  res.sendfile('./public/index.html');
});

app.get('/results', function(req, res){
  res.sendfile('./public/results.html');
});

app.get('/scrape2', function(req, res){
  doAnalytics("scrape2", req);
  res.sendfile('./public/results2.html');
});

// this route scrapes, makes a json and sends the results view
app.get('/scrape', function(req, res){
  process.stdout.write('\033c');
  var urlforscrape;
  if (process.env.OPENSHIFT_NODEJS_PORT) {
    urlforscrape = 'http://www.parkrun.com/results/consolidatedclub/?clubNum=1537'} else {
    urlforscrape =  'http://localhost:8000/results_Consolidated_parkrun.html' }
    console.info("url is ", urlforscrape);
  var options = { 
    url : urlforscrape,
    headers: { 'User-Agent': 'request' }
  };
  doAnalytics("scrape", req);

  var linksjson =[];
  // STAGE ONE: Get all the relevant Links:
  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){console.log('Not error in consolidated!')}
    var $ = cheerio.load(html);
    $('.floatleft a').not('.sortable').each(function(i, element){
      test=element.attribs.href;
      if(test.indexOf("weekly")!=-1){
        linksjson.push({"website": test});
      }
    });
    // now the linksjson has the links to each parkrun, write the file
    fs.writeFile('public/links.json', JSON.stringify(linksjson, null, 4), function(err){
      console.log('File links.json successfully written! - Check your project directory for the links.json file' );
      console.log('There are', linksjson.length, 'links to be scraped');
    });
  });  // end of the request routine

// STAGE TWO: Scrape the Links for Relevant Data:
var numberOfLinksScraped = 0;
var timerFunction0 = setTimeout(function(){
  // this route does the scraping and saves to json it is working.
  var json =[], countsjson=[];  // agecats=[], agecatsall=[],
  var numberOfEastleighMen=[], numberOfMen=[];
  var numberOfEastleighWomen=[], numberOfWomen=[];
  fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
  var options = {
      url : linksjson[0].website,
      headers: {
        'User-Agent': 'request'
      }
  };
  // Here, iterate through each link and extract the data from each website
  for(website in linksjson)
    { 
    options.url = linksjson[website].website;
      //console.log("indiv scrapes, here is the website"); /// here website is 0,1,2,3 .....
      request(options, function(error, response, html){
        if(error){console.log('There was an error', error)};
        if(!error){
          console.log("no error, scraping, website id is ", linksjson[website].website.slice(linksjson[website].website.indexOf('uk/')+3, linksjson[website].website.indexOf('/results'))   );
          var $ = cheerio.load(html);
          // here pick out the title
          var runTitle=$('h2').text();
          // agecats[runTitle]={};
          numberOfEastleighMen[runTitle]=0;
          numberOfEastleighWomen[runTitle]=0;
          numberOfMen[runTitle]=0;
          numberOfWomen[runTitle]=0;
          var site = $('#primary h2').text()
          //Here, pick out the data and assign json iterate each table row
          $('table.sortable tbody tr').each(function(i, element){ 
            var children = $(this).children();
            //  here work out the age gradings.
            // agecat=children.eq(3).text(); //pluck the agecat %
            // if(agecat in agecats[runTitle]){
            //   agecats[runTitle][agecat]=agecats[runTitle][agecat]+1;
            // }else{
            //   agecats[runTitle][agecat]=1;
            // }

            //var x = children.eq(4).text() ? parseFloat(children.eq(4).text()) : null;

            json.push({ "parkrun" : $('#primary h2').text(), "pos" : children.eq(0).text(), "parkrunner" :  children.eq(1).text(), "time": children.eq(2).text(), "agecat" : children.eq(3).text(), "agegrade" : children.eq(4).text(),  "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text()});
            // have cut out this:  "AgeRank" : agecats[runTitle][agecat],
            if(children.eq(7).text() === "Eastleigh RC"){
              if(children.eq(5).text()==="M"){numberOfEastleighMen[runTitle]+=1};
              if(children.eq(5).text()==="F"){numberOfEastleighWomen[runTitle]+=1};
            }   
            if(children.eq(5).text()==="M"){numberOfMen[runTitle]+=1};
            if(children.eq(5).text()==="F"){numberOfWomen[runTitle]+=1};
          }); // end of each element in table sortable
         }
         countsjson.push({ "runTitle" : runTitle, "numberOfEastleighMen" : numberOfEastleighMen[runTitle], "numberOfEastleighWomen" : numberOfEastleighWomen[runTitle], "numberOfMen": numberOfMen[runTitle], "numberOfWomen": numberOfWomen[runTitle] });
         numberOfLinksScraped += 1;
         console.log('And Number of links scraped is ', numberOfLinksScraped, 'requires', linksjson.length);  
      });
  };
  
  // START OF VERY CLEVER IDEA
  
  sortAndWrite();

  function sortAndWrite(){
    if (numberOfLinksScraped < linksjson.length) { setTimeout(sortAndWrite, 100) } else {
      var timerFunction1 = setTimeout(function(){
        json.sort(function(a,b) { 
          if(a.agegrade == '') { return +1 };
          if(a.parkrun !== b.parkrun) { if(a.parkrun < b.parkrun) {return -1} else if(a.parkrun > b.parkrun) {return +1} };
          if (parseInt(b.agegrade) > parseInt(a.agegrade)) { return  1} else { return -1};
        });
        console.log('finished sorting'); 
      },500); // lets allow 200ms in case the json is not fully assigned then sort it.

      // STAGE 4: ASSIGN age grade positions and groom data
      var timerFunction3 = setTimeout(function(){
        console.log('start grooming');
        var previousWebSite = json[0].parkrun;
        counter = 1;
        numberSpliced = 0;
        for (i = 0; i< json.length; i++){
          if(json[i].parkrun !== previousWebSite){
            //console.log("detected a change in parkrun", i, json[i].parkrun, previousWebSite);
            previousWebSite = json[i].parkrun;
            counter = 1;
          };
          if(json[i].parkrunner == "Unknown" || json.time == ""){
            //console.log('*** want to splice ', json[i].parkrun, "***" , json[i].pos, '**', i);
            json.splice(i,1);
            numberSpliced +=1;
          } else {
            json[i].agerank = counter;
          }
          counter +=1;
        };
        console.log("I spliced:", numberSpliced);

        // STAGE 5: SAVE THE DATA
        var timerFunction2 = setTimeout(function(){
          console.log('****** WRITING FILES ******');
          fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
          fs.writeFileSync('public/counts.json', JSON.stringify(countsjson, null, 4));
          console.log("File written! - Check your output.json and countsjson files");
        }, 1500);  // allow this to splice the data before save
      }, 1000);  // end of stage 4 assigning and grooming
    }
  }  // end of sort and write  
  //  END OF VERY CLEVER IDEA

}, 1500); // end of stage 2 (1500ms is to collect the links) timerFunction0;


var timerFunction4 = setTimeout(function(){
  res.sendfile('./public/results.html');
}, 4300);
});

function doAnalytics(page, req){
  analsjson=[];
  var time = new Date();
  var year = time.getFullYear();
  var month = time.getMonth()+1;
  var date1 = time.getDate();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  var timeDate= "Time "+  year + "-" + month+"-"+date1+" "+hour+":"+minutes+":"+seconds;
  analsjson.push({"TimeAndDate": timeDate, "Page": page, "UserAgent": req.headers['user-agent'], "UserIP":req.headers['x-forwarded-for'] })
  fs.appendFile('public/analytics.json', JSON.stringify(analsjson, null, 4), function (err) {
  });
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});
