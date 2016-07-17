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

app.get('/scrape2', function(req, res){
  res.sendfile('./public/results2.html');
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
  analsjson.push({"TimeAndDate": timeDate, "UserAgent": req.headers['user-agent'], "UserIP":req.headers['x-forwarded-for'] })
  fs.appendFile('public/analytics.json', JSON.stringify(analsjson, null, 4), function (err) {
  });

  var linksjson =[];
  // Stage One: Get all the relevant Links:
  request(options, function(error, response, html){
    if(error){console.log('There was an error', error)};
    if(!error){console.log('not an error!')}
      //console.log("something from the request to consolidated");
    var $ = cheerio.load(html);
    console.log('loaded webpage consolodated no errors');
    $('.floatleft a').not('.sortable').each(function(i, element){
      test=element.attribs.href;
      if(test.indexOf("weekly")!=-1){
        //console.log("linksjson push this:", test, i);
        linksjson.push({"website": test});
      }
    });
    // now the linksjson has the links to each parkrun, write the file
    fs.writeFile('public/links.json', JSON.stringify(linksjson, null, 4), function(err){
      //console.log('File links.json successfully written! - Check your project directory for the links.json file');
    });
  });  // end of the request routine

// Stage Two: Scrape the Links for Relevant Data:
var timerFunction0 = setTimeout(function(){
// this route does the scraping and saves to json it is working.
  // Let's scrape
  // console.log("from individual scrapes");
  // First clean the output.json
  var json =[];
  var agecats=[];
  var countsjson=[];
  var top12sjson=[];
  var numberOfEastleighMen=[];
  var numberOfMen=[];
  var numberOfEastleighWomen=[];
  var numberOfWomen=[];
  var top12s={};
  var nottop12s=[];
  var top12thsAgeGradesForRunjson;
  fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
  // console.log("json cleaned / created");
  // now go through all the websites where there are results:
  var options = {
      url : linksjson[0].website,
      headers: {
        'User-Agent': 'request'
      }
  };
  // console.log('after set options');
  // Here, iterate through each link and extract the data from each website
  for(website in linksjson)
  { 
    options.url = linksjson[website].website;
      // console.log("indiv scrapes, here is the website"); /// here website is 0,1,2,3 .....
      request(options, function(error, response, html){
        if(error){console.log('There was an error', error)};
        if(!error){
          console.log("no error, scraping, website id is ", linksjson[website].website);
          var $ = cheerio.load(html);
          // here pick out the title
          var runTitle=$('h2').text();
          agecats[runTitle]={}
          numberOfEastleighMen[runTitle]=0;
          numberOfEastleighWomen[runTitle]=0;
          numberOfMen[runTitle]=0;
          numberOfWomen[runTitle]=0;
          var site = $('#primary h2').text()
          top12s[site]=[];
          //numberOfEastleighWomen[runTitle]=0;
          //Here, pick out the data and assign json iterate each table row
          $('table.sortable tbody tr').each(function(i, element){ 
            var children = $(this).children();
            //  here work out the age gradings.
            agecat=children.eq(3).text();
            if(agecat in agecats[runTitle]){
              agecats[runTitle][agecat]=agecats[runTitle][agecat]+1;
            }else{
              agecats[runTitle][agecat]=1;
            }
            // console.log("indivdual runs ids agecat", agecat, agecats[runTitle][agecat]);
            //  here work out top12
            var x = children.eq(4).text() ? parseFloat(children.eq(4).text()) : null;
            //console.log('here is x: ' , x, 'and length', top12s.site.length);
            if(top12s[site].length < 12 && x != null) { top12s[site].push(x) }  
            if (x > top12s[site][0]){
              top12s[site].push(x);
              top12s[site].sort(function(a, b){return b-a});
              if(top12s[site].length > 12){
                top12s[site].pop();}
            }
            //console.log('starting to sort agegrades', top12s[site], 'and length', top12s[site].length, '12thbyAge Age Grade is', top12s[site][top12s[site].length-1] );
            // console.log('top12s', top12s)

            if(children.eq(7).text() === "Eastleigh RC"){
              json.push({ "parkrun" : $('#primary h2').text(), "pos" : children.eq(0).text(), "parkrunner" :  children.eq(1).text(), "time": children.eq(2).text(), "agecat" : children.eq(3).text(), "agegrade" : children.eq(4).text(), "AgeRank" : agecats[runTitle][agecat], "gender" : children.eq(5).text(), "genderpos" : children.eq(6).text(), "club" : children.eq(7).text(), "Note" : children.eq(8).text(), "TotalRuns" : children.eq(9).text()});
              if(children.eq(5).text()==="M"){numberOfEastleighMen[runTitle]=numberOfEastleighMen[runTitle]+1};
              if(children.eq(5).text()==="F"){numberOfEastleighWomen[runTitle]=numberOfEastleighWomen[runTitle]+1};
            }   
            if(children.eq(5).text()==="M"){numberOfMen[runTitle]=numberOfMen[runTitle]+1};
            if(children.eq(5).text()==="F"){numberOfWomen[runTitle]=numberOfWomen[runTitle]+1};
          }); // end of each element in table sortable
          //  here try to put json into top12sjson with removing non top 12s ?
         }
         countsjson.push({ "runTitle" : runTitle, "numberOfEastleighMen" : numberOfEastleighMen[runTitle], "numberOfEastleighWomen" : numberOfEastleighWomen[runTitle], "numberOfMen": numberOfMen[runTitle], "numberOfWomen": numberOfWomen[runTitle] });
      });
  }

  var timerFunction1 = setTimeout(function(){
    console.log("should be 1 seconds later writing file");
    fs.writeFileSync('public/output.json', JSON.stringify(json, null, 4));
    fs.writeFileSync('public/counts.json', JSON.stringify(countsjson, null, 4));
    jsontop12s=json;
    // now lets clear the under top12s out of the json!
    for (var i=0; i<jsontop12s.length; i+=1) {
      if (parseFloat(jsontop12s[i].agegrade) < parseFloat(top12s[jsontop12s[i].parkrun][top12s[jsontop12s[i].parkrun].length-1])) {
        console.log('i want to pop', parseFloat(jsontop12s[i].agegrade), 'because < ', parseFloat(top12s[jsontop12s[i].parkrun][top12s[jsontop12s[i].parkrun].length-1], 'from', jsontop12s[i].parkrun ));
        console.log( jsontop12s.splice(i,1));
        nottop12s.push(jsontop12s.splice(i,1)[0]);
      }
    }
    fs.writeFileSync('public/top12s.json', JSON.stringify(jsontop12s, null, 4));
    fs.writeFileSync('public/nottop12s.json', JSON.stringify(nottop12s, null, 4));
    fs.writeFileSync('public/top12thsAgeGradesForRunjson.json', JSON.stringify(top12s, null, 4));
    console.log("File written! - Check your output.json and countsjson files");
  },3500);
}, 1500);

console.log("and this is after the subroutine before file send");
var timerFunction2 = setTimeout(function(){
res.sendfile('./public/results.html');
}, 4000);

});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.listen(app.get('port') ,app.get('ip'), function () {
  console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});
