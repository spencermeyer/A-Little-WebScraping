// Scraping runs!

$( document ).ready(function() {
  //console.log("This is injector.js required in results html");
  var sortyBy='POS';

  $('#sorter').append('<button type="button" class="btn btn-primary">Sort By Age Grade Position</button>');
  $('#sorter').click(function(){
    console.log('Clicked!!!!');
    sortBy='AGE';
    experimentEFB(); /// is not a function
    $('#inject_here').detach();
  })


  var timerFunction1 = setTimeout(function(){
      var htmlIntro = '<p> Today there were runners from: </p>';
      $.getJSON("links.json", function (links) {
        for (i = 0; i < links.length; i++) {
          var runIdentifier = links[i].website.slice(links[i].website.indexOf('uk/')+3, links[i].website.indexOf('/results'));
          htmlIntro=htmlIntro + '<div class="intro-links"><a href="' + links[i].website + '">';
          htmlIntro=htmlIntro + runIdentifier;
          htmlIntro=htmlIntro + '</a>' + '<span id="more-info' + i + '"></span></div>'
        }
        $('#inject_here').append(htmlIntro);
        $('#spinner').css("display", "none");
      });
  },1000);

  var experimentEFB = function(){
    console.log('eelsfeastbucket');
  };

  var timerFunction2 = setTimeout(function(){
    var pbclass="nopb";
    var ageCatClass="normal-age";
    var agePosClass="normal-age";
    //console.log("should be 1.5 seconds after loading");
    $.getJSON("output.json", function (result) {
      //console.log('got some json?', result.length);
      var htmltoappend = '<table id="results" class="table table-bordered table-hover">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr class="row"><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' +'<th>' + 'AgeGradePos' + '</th>' + '<th id="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'

      // here want to sort the result
      result.forEach(function(line, index){ 
        if(!line.club.includes('Eastleigh RC')){
          result.splice(index,1);
        }
      });

      result.sort(function(a,b) {
        if(a.agegrade == '') { return +1 };
        if(a.parkrun !== b.parkrun) { if(a.parkrun < b.parkrun) {return -1} else if(a.parkrun > b.parkrun) {return +1} };
        //if (parseInt(b.agegrade) > parseInt(a.agegrade)) { return  1} else { return -1};
        if (parseInt(b.pos) < parseInt(a.pos)) { return  1} else { return -1};
      });

      for (i = 0; i < result.length; i++) {

        if(result[i].club == "Eastleigh RC"){
          if(result[i].AgeRank < 2){agePosClass="good-in-age"}else{agePosClass="normal-age"};
          if(parseFloat(result[i].agegrade) > 70){ ageCatClass="fast-age" }else{ageCatClass="normal-age"};
          if(result[i].Note =="New PB!"){pbclass="newpb"}else{pbclass="nopb"};

          htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + result[i].parkrun.split(" ")[0] + '</td><td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td class="position">' + result[i].pos + '</td><td class="parkrunner">' + result[i].parkrunner + '</td>' + '<td class="time">' + result[i].time + '</td>' + '<td class="agecat">' + result[i].agecat + '</td>';
          htmltoappend = htmltoappend + '<td class="agegrade ' + ageCatClass +  '"">' + result[i].agegrade + '</td>'+ '<td class='+ agePosClass + '>'+ result[i].agerank + '</td>' + '<td id="gender">' + result[i].gender + '</td>' + '<td class="genderpos">' + result[i].genderpos + '</td>';
          htmltoappend = htmltoappend + '<td class="note '+pbclass + '">' + result[i].Note + '</td>';
          htmltoappend = htmltoappend + '<td class="totalruns">' + result[i].TotalRuns + '</th>' + '</tr>';
          }
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });
  },6600);


  var timerFunction3 = setTimeout(function(){
    var countsHTML = '<table class="table table-bordered table-hover"><th>Run Location</th><th>Number Of Eastleigh Men</th><th>Number of Eastleigh Women</th><th>Total Men</th><th>Total Women</th><th>Total</th>'
    //console.log('countsHTML before loop', countsHTML);
    $.getJSON("counts.json", function(links){
      //console.log("got the counts");
      for (i = 0; i < links.length; i++) {
        var runTitleForInjection = links[i].runTitle.slice(links[i].runTitle.indexOf('count')+1, links[i].runTitle.indexOf('parkrun #'));
        //console.log(runTitleForInjection);
        //console.log("from count", runTitleForInjection, links[i].numberOfEastleighMen, links[i].numberOfEastleighWomen);
        countsHTML = countsHTML + '<tr><td>' + runTitleForInjection + '</td><td>' + links[i].numberOfEastleighMen + '</td><td>' + links[i].numberOfEastleighWomen+'</td><td>'+links[i].numberOfMen + '</td><td>' + links[i].numberOfWomen +  '</td><td>'+ (parseInt(links[i].numberOfMen) + parseInt(links[i].numberOfWomen)) +'</td></tr>';
        //console.log("constructing individual count row", countsHTML);
      }
    });
    var timerFunction4 = setTimeout(function(){
      countsHTML = countsHTML + '</table>';
      //console.log("injecting count table", countsHTML);
      $("#inject_here2").append(countsHTML);
    }, 1500);
  },1500);


});
