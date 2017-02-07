$( document ).ready(function() {
  $.getJSON("milestones.json", function (milestones) {
    var htmltoappend = '<table id="milestones" class="table table-bordered table-hover">';
    htmltoappend = htmltoappend + '<thead>';
    htmltoappend = htmltoappend + '<tr class="row"><th class="justify-left">RunnerName</th><th>Age Cat</th><th>Club</th><th>Number of Runs</th></tr></thead>';
    milestones.forEach(function(milestone){
      htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + milestone.parkrunner + '</td>';
      htmltoappend = htmltoappend + '<td>' + milestone.agecat + '</td>';
      htmltoappend = htmltoappend + '<td>' + milestone.club + '</td>';
      htmltoappend = htmltoappend + '<td>' + milestone.TotalRuns + '</td></tr>';
    });
    htmltoappend = htmltoappend + '</table>'
    var injectIt=setTimeout(function(){
        $('#inject-milestones-here').append(htmltoappend);
      }, 100);
  });
});
