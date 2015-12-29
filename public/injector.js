// Try to scrape parkrun

$( document ).ready(function() {
  console.log( "ready!" );

  console.log("hello from scraper.js required in index html");

  $.getJSON("output.json", function(result){
    console.log("got some jason ? ");
    console.log(result);

    var htmltoappend = '<table id="results" class="table-bordered">'
    htmltoappend = htmltoappend + '<tbody>'
    htmltoappend = htmltoappend + '<tr><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' + '<th>'+'Gender' + '</th>' + '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';


    for (i = 0; i < result.length; i++) {
      console.log("logic?  ", result[i]!==null );
      if(result[i]!==null) { 
        console.log("going into loop ",i);
        htmltoappend = htmltoappend + '<tr><td>' + result[i].pos + '</td><td>' + result[i].parkrunner + '</td>' + '<td>' + result[i].time + '</td>' + '<td>' + result[i].agecat + '</td>' + '<td>' + result[i].agegrade + '</td>' + '<td>' + result[i].gender + '</td>' + '<td>' + result[i].genderpos + '</td>' + '<td>' + result[i].Note + '</td>' + '<td>' + result[i].TotalRuns + '</th>' + '</tr>';
      }
    }

    htmltoappend = htmltoappend + '</tbody>' + '</table>';

    $('#inject_here').append(htmltoappend);
  });

console.log("container loaded?");

});




