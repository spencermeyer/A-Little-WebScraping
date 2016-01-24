// Try to scrape parkrun

$( document ).ready(function() {
  console.log("This is injector.js required in results html");

  var timerFunction1 = setTimeout(function(){
      console.log("in first timer");
      var htmlIntro = '<p> Today there were runners from: </p>';
      $.getJSON("links.json", function (links) {
        console.log("got links", links[0].website)
        for (i = 0; i < links.length; i++) {
          htmlIntro=htmlIntro + '<p>' + links[i].website + '</p>'
        }
        $('#inject_here').append(htmlIntro);
      });
  },1000);

  var timerFunction2 = setTimeout(function(){
    console.log("should be 1.5 seconds after loading");
    $.getJSON("output.json", function (result) {
      console.log('got some json?', result.length);
      var htmltoappend = '<table id="results" class="table">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' + '<th id="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'
      for (i = 0; i < result.length; i++) {
        htmltoappend = htmltoappend + '<tr>' + '<td>' + result[i].parkrun.split(" ")[0] + '</td><td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td>' + result[i].pos + '</td><td>' + result[i].parkrunner + '</td>' + '<td>' + result[i].time + '</td>' + '<td>' + result[i].agecat + '</td>' + '<td>' + result[i].agegrade + '</td>' + '<td id="gender">' + result[i].gender + '</td>' + '<td>' + result[i].genderpos + '</td>' + '<td>' + result[i].Note + '</td>' + '<td>' + result[i].TotalRuns + '</th>' + '</tr>';
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });
  console.log("Injected2 ?");
  },1500);

});
