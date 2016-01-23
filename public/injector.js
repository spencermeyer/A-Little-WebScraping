// Try to scrape parkrun

$( document ).ready(function() {
  console.log("This is injector.js required in results html");

  var timerFunction2 = setTimeout(function(){
    console.log("should be 1.5 seconds after loading");
    $.getJSON("output.json", function (result) {
      console.log('got some json?', result.length);
      var htmltoappend = '<table id="results" class="table table-bordered">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' + '<th class="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'
      for (i = 0; i < result.length; i++) {
        htmltoappend = htmltoappend + '<tr>' + '<td>' + result[i].parkrun.split(" ")[0] + '</td><td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td>' + result[i].pos + '</td><td>' + result[i].parkrunner + '</td>' + '<td>' + result[i].time + '</td>' + '<td>' + result[i].agecat + '</td>' + '<td>' + result[i].agegrade + '</td>' + '<td class="gender">' + result[i].gender + '</td>' + '<td>' + result[i].genderpos + '</td>' + '<td>' + result[i].Note + '</td>' + '<td>' + result[i].TotalRuns + '</th>' + '</tr>';
        console.log(result[i].parkrun.split(" ")[0]);
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });

  console.log("Injected?");
  },1500);

});
