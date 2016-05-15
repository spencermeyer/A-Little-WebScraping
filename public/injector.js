// Try to scrape parkrun

$( document ).ready(function() {
  console.log("This is injector.js required in results html");

  var timerFunction1 = setTimeout(function(){
      console.log("in first timer");
      var htmlIntro = '<p> Today there were runners from: </p>';
      $.getJSON("links.json", function (links) {
        console.log("got links", links[0].website)
        for (i = 0; i < links.length; i++) {
          htmlIntro=htmlIntro + '<div class="intro-links"><a href="' + links[i].website + '">' + links[i].website + '</a>' + '<span id="more-info' + i + '"></span></div><br>'
          //<p class="nextinject">hello</p></span>'
        }
        $('#inject_here').append(htmlIntro);
      });
  },1000);

  var timerFunction2 = setTimeout(function(){
    var pbclass="nopb";
    var ageCatClass="normal-age";
    var agePosClass="normal-age";
    console.log("should be 1.5 seconds after loading");
    $.getJSON("output.json", function (result) {
      console.log('got some json?', result.length);
      var htmltoappend = '<table id="results" class="table table-bordered table-hover">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr class="row"><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' +'<th>' + 'AgeGradePos' + '</th>' + '<th id="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'

      for (i = 0; i < result.length; i++) {

        if(result[i].AgeRank < 2){agePosClass="good-in-age"}else{agePosClass="normal-age"};
        if(parseFloat(result[i].agegrade) > 70){ ageCatClass="fast-age" }else{ageCatClass="normal-age"};
        if(result[i].Note =="New PB!"){pbclass="newpb"}else{pbclass="nopb"};

        htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + result[i].parkrun.split(" ")[0] + '</td><td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td class="position">' + result[i].pos + '</td><td class="parkrunner">' + result[i].parkrunner + '</td>' + '<td class="time">' + result[i].time + '</td>' + '<td class="agecat">' + result[i].agecat + '</td>';
        htmltoappend = htmltoappend + '<td class="agegrade ' + ageCatClass +  '"">' + result[i].agegrade + '</td>'+ '<td class='+ agePosClass + '>'+ result[i].AgeRank + '</td>' + '<td id="gender">' + result[i].gender + '</td>' + '<td class="genderpos">' + result[i].genderpos + '</td>';
        htmltoappend = htmltoappend + '<td class="note '+pbclass + '">' + result[i].Note + '</td>';
        htmltoappend = htmltoappend + '<td class="totalruns">' + result[i].TotalRuns + '</th>' + '</tr>';
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });
  console.log("Injected2 ?");
  },4000);
});
