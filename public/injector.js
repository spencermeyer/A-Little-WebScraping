// Try to scrape parkrun

$( document ).ready(function() {
  console.log("This is injector.js required in results html");

  var sourcesjson = { 1 : ["output.json", "#inject_here"],
                      2 : ["output_n.json", "#inject_here_n"],
                      3 : ["output_s.json", "#inject_here_s"],
                      4 : ["output_w.json", "#inject_here_w"],
                    };

  $.each (sourcesjson, function (key, value) { 
    console.log ("key value[0] value[1] ", key, value[0], value[1]);
    console.log("source is: ", value[0]);
    $.getJSON(value[0], function(result){
  //$.getJSON("output.json", function(result){
    //console.log("got some jason ? ");
    //console.log(result);

    var htmltoappend = '<table id="results" class="table-bordered">'
    htmltoappend = htmltoappend + '<tbody>'
    htmltoappend = htmltoappend + '<tr><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' + '<th>'+'Gender' + '</th>' + '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';

    for (i = 0; i < result.length; i++) {
      // console.log("logic?  ", result[i]!==null );
      if(result[i]!==null) { 
        //console.log("going into loop ",i);
        htmltoappend = htmltoappend + '<tr><td>' + result[i].pos + '</td><td>' + result[i].parkrunner + '</td>' + '<td>' + result[i].time + '</td>' + '<td>' + result[i].agecat + '</td>' + '<td>' + result[i].agegrade + '</td>' + '<td>' + result[i].gender + '</td>' + '<td>' + result[i].genderpos + '</td>' + '<td>' + result[i].Note + '</td>' + '<td>' + result[i].TotalRuns + '</th>' + '</tr>';
      }
    }

    htmltoappend = htmltoappend + '</tbody>' + '</table>';

    $(value[1]).append(htmltoappend);
    //$('#inject_here').append(htmltoappend);
  });

});

console.log("container loaded?");
});




