$( document ).ready(function() {

  var buttons = [{id: '#sorter1', title: 'Sort By Age Grade', argument: 'AGE' },
                 {id: '#sorter2', title: 'Sort By Age Grade, only top 12s', argument: 'AGE12'},
                 {id: '#sorter3', title: 'Sort By Position', argument: 'POS'}]; 

  buttons.forEach(function(button){
    $(button.id).append('<button type="button" class="btn btn-primary">'+button.title+'</button>');
    $(button.id).click(function(){
      $('#inject_here').children("table").remove();
      $('#inject_here2').children("table").remove();
      insertData(button.argument);
      insertCountsData();
    });
  });               

  $('#sorter-milestones').append('<a class="btn btn-success" href="/milestones">Milestones (new Feature!)</a>');
  $('#sorter-milestones').click(function(){
    console.log("navigate!!!! to milestones");
  });

  var introFunction1 = setTimeout(function(){
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

  var mainResultsTimer = setTimeout(function(){
    insertData('AGE');
  }, 6600);

  var countsResultsTimer = setTimeout(function(){
    insertCountsData();
  }, 1500);

  function insertData(sortByArg){
    var pbclass="nopb";
    var ageCatClass="normal-age";
    var agePosClass="normal-age";
    $.getJSON("output.json", function (result) {
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
        if(sortByArg == 'POS'){
          if (parseInt(b.pos) < parseInt(a.pos)) { return  1} else { return -1};
        } else if (sortByArg == 'AGE' || sortByArg == 'AGE12') {
          if (parseFloat(b.agegrade) > parseFloat(a.agegrade)) { return  1} else { return -1};
        } else { return 0 };
      });
      for (i = 0; i < result.length; i++) {
        if(sortByArg == 'AGE12' && result[i].agegraderank < 13 || sortByArg == 'AGE' || sortByArg == 'POS') {
          if(result[i].club == "Eastleigh RC"){
            if(result[i].AgeRank < 2){agePosClass="good-in-age"}else{agePosClass="normal-age"};
            if(parseFloat(result[i].agegrade) > 70){ ageCatClass="fast-age" }else{ageCatClass="normal-age"};
            if(result[i].Note =="New PB!"){pbclass="newpb"}else{pbclass="nopb"};
            htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + result[i].parkrun.split(" ")[0] + '</td><td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td class="position">' + result[i].pos + '</td><td class="parkrunner">' + result[i].parkrunner + '</td>' + '<td class="time">' + result[i].time + '</td>' + '<td class="agecat">' + result[i].agecat + '</td>';
            htmltoappend = htmltoappend + '<td class="agegrade ' + ageCatClass +  '"">' + result[i].agegrade + '</td>'+ '<td class='+ agePosClass + '>'+ result[i].agegraderank + '</td>' + '<td id="gender">' + result[i].gender + '</td>' + '<td class="genderpos">' + result[i].genderpos + '</td>';
            htmltoappend = htmltoappend + '<td class="note '+pbclass + '">' + result[i].Note + '</td>';
            htmltoappend = htmltoappend + '<td class="totalruns">' + result[i].TotalRuns + '</th>' + '</tr>';
            }
          }
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });
  };

  function insertCountsData(){
    var countsHTML = '<table class="table table-bordered table-hover"><th>Run Location</th><th>Number Of Eastleigh Men</th><th>Number of Eastleigh Women</th><th>Total Men</th><th>Total Women</th><th>Total</th>'
    $.getJSON("counts.json", function(links){
      //console.log("got the counts");
      for (i = 0; i < links.length; i++) {
        var runTitleForInjection = links[i].runTitle.slice(links[i].runTitle.indexOf('count')+1, links[i].runTitle.indexOf('parkrun #'));
        countsHTML = countsHTML + '<tr><td>' + runTitleForInjection + '</td><td>' + links[i].numberOfEastleighMen + '</td><td>' + links[i].numberOfEastleighWomen+'</td><td>'+links[i].numberOfMen + '</td><td>' + links[i].numberOfWomen +  '</td><td>'+ (parseInt(links[i].numberOfMen) + parseInt(links[i].numberOfWomen)) +'</td></tr>';
      }
    });
    var timerFunction4 = setTimeout(function(){
      countsHTML = countsHTML + '</table>';
      $("#inject_here2").append(countsHTML);
    }, 1500);
  };

});
