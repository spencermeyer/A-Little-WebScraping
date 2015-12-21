// Try to scrape parkrun

$( document ).ready(function() {
  console.log( "ready!" );


  console.log("hello from scraper.js required in index html");


  $.getJSON("example.json", function(result){
    console.log("got some jason ? ");
    console.log(result);

    var htmltoappend = '<table id="results">'
    htmltoappend = htmltoappend + '<tbody>'
    htmltoappend = htmltoappend + '<tr><td>' + result.pos + '</td><td>' + result.parkrunner + '</td>' + '<td>' + result.time + '</td>' + '<td>' + result.agecat + '</td>' + '</tr>'
    htmltoappend = htmltoappend + '</tbody>' + '</table>'
    console.log("and htmltoappend is: ", htmltoappend);
    $('#inject_here').append(htmltoappend);
  });





console.log("container loaded?");


});




