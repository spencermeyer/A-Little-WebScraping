// Scraping runs!

$( document ).ready(function() {
  console.log("This is injector2.js required in results2 html");

  var timerFunction2 = setTimeout(function(){
    var pbclass="nopb";
    var ageCatClass="normal-age";
    var agePosClass="normal-age";
    var genderposclass="genderpos";
    //console.log("should be 1.5 seconds after loading");
    $.getJSON("top12s.json", function (result) {
      //console.log('got some json?', result.length);
      result.sort(
        function(a,b){ 
          if(a.parkrun < b.parkrun) return -1
          if(a.parkrun > b.parkrun) return 1
          if(a.parkrun === b.parkrun) {
            return a.AgeRank < b.AgeRank ? -1 : a.AgeRank > b.AgeRank ? 1 : 0;
          }
          return 0
          }
        );   //************  SORT THIS SORT  !!!!
      var htmltoappend = '<table id="results" class="table table-bordered table-hover">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr class="row"><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' +'<th>' + 'AgeGradePos' + '</th>' + '<th id="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'

      for (i = 0; i < result.length; i++) {
        if(result[i].AgeRank < 2){agePosClass="good-in-age"}else{agePosClass="normal-age"};
        if(parseFloat(result[i].agegrade) > 70){ ageCatClass="fast-age" }else{ageCatClass="normal-age"};
        if(result[i].Note =="New PB!"){pbclass="newpb"}else{pbclass="nopb"};
        if(result[i].genderpos==1){genderposclass="gender-pos-win"}else{genderposclass="genderpos"};        
        if(result[i].AgeRank < 13) {
          htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + result[i].parkrun.split(" ")[0] + '</td>';
          htmltoappend = htmltoappend + '<td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td class="position">' + result[i].pos + '</td><td class="parkrunner">' + result[i].parkrunner + '</td>';
          htmltoappend = htmltoappend + '<td class="time">' + result[i].time + '</td>' + '<td class="agecat">' + result[i].agecat + '</td>';
          htmltoappend = htmltoappend + '<td class="agegrade ' + ageCatClass +  '"">' + result[i].agegrade + '</td>'
          htmltoappend = htmltoappend + '<td class=' + agePosClass + '>'+ result[i].AgeRank + '</td>'
          htmltoappend = htmltoappend + '<td id="gender">' + result[i].gender + '</td>' + '<td class=' + genderposclass + '>' + result[i].genderpos + '</td>';
          htmltoappend = htmltoappend + '<td class="note ' + pbclass + '">' + result[i].Note + '</td>';
          htmltoappend = htmltoappend + '<td class="totalruns">' + result[i].TotalRuns + '</th>' + '</tr>';
        }
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here').append(htmltoappend);
    });
  //console.log("Injected2 ?");
  },4000);

  var timerFunction3 = setTimeout(function(){
    var pbclass="nopb";
    var ageCatClass="normal-age";
    var agePosClass="normal-age";
    var genderposclass="genderpos";
    //console.log("should be 1.5 seconds after loading");
    $.getJSON("nottop12s.json", function (result) {
      //console.log('got some json?', result.length);
      result.sort(
        function(a,b){ 
          if(a.parkrun < b.parkrun) return -1
          if(a.parkrun > b.parkrun) return 1
          if(a.parkrun === b.parkrun) {
            return a.AgeRank < b.AgeRank ? -1 : a.AgeRank > b.AgeRank ? 1 : 0;
          }
          return 0
          }
        );   //************  SORT THIS SORT  !!!!
      var htmltoappend = '<table id="results" class="table table-bordered table-hover">'
      htmltoappend = htmltoappend + '<thead>'
      htmltoappend = htmltoappend + '<tr class="row"><th>'+'Parkrun'+'</th><th>'+'Date'+'</th><th>' + "Result" + '</th><th>' + 'Parkrunner' + '</th>' + '<th>' + 'Time' + '</th>' + '<th>' + 'Agecat' + '</th>' + '<th>' + 'Agegrade' +'<th>' + 'AgeGradePos' + '</th>' + '<th id="gender">'+'Gender' + '</th>' +  '<th>' + 'GenderPos' + '</th>' + '<th>' + 'Note' + '</th>' + '<th>' + 'Total Runs' + '</th></tr>';
      htmltoappend = htmltoappend + '</thead><tbody>'

      for (i = 0; i < result.length; i++) {
        if(result[i].AgeRank < 2){agePosClass="good-in-age"}else{agePosClass="normal-age"};
        if(parseFloat(result[i].agegrade) > 70){ ageCatClass="fast-age" }else{ageCatClass="normal-age"};
        if(result[i].Note =="New PB!"){pbclass="newpb"}else{pbclass="nopb"};
        if(result[i].genderpos==1){genderposclass="gender-pos-win"}else{genderposclass="genderpos"};        
        if(result[i].AgeRank < 13) {
          htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + result[i].parkrun.split(" ")[0] + '</td>';
          htmltoappend = htmltoappend + '<td>'+ result[i].parkrun.substr(result[i].parkrun.length-10) + '</td><td class="position">' + result[i].pos + '</td><td class="parkrunner">' + result[i].parkrunner + '</td>';
          htmltoappend = htmltoappend + '<td class="time">' + result[i].time + '</td>' + '<td class="agecat">' + result[i].agecat + '</td>';
          htmltoappend = htmltoappend + '<td class="agegrade ' + ageCatClass +  '"">' + result[i].agegrade + '</td>'
          htmltoappend = htmltoappend + '<td class=' + agePosClass + '>'+ result[i].AgeRank + '</td>'
          htmltoappend = htmltoappend + '<td id="gender">' + result[i].gender + '</td>' + '<td class=' + genderposclass + '>' + result[i].genderpos + '</td>';
          htmltoappend = htmltoappend + '<td class="note ' + pbclass + '">' + result[i].Note + '</td>';
          htmltoappend = htmltoappend + '<td class="totalruns">' + result[i].TotalRuns + '</th>' + '</tr>';
        }
      }
      htmltoappend = htmltoappend + '</tbody>' + '</table>';
      $('#inject_here3').append(htmltoappend);
    });
  //console.log("Injected2 ?");
  },4000);


  var timerFunction4 = setTimeout(function(){
    $.getJSON("top12thsAgeGradesForRunjson.json", function (result) {
      htmltoappend='<table id="results" class="table table-bordered table-hover">'
      //console.log(result);
      //console.log('length is', result.length);
      for (var k in result){
        console.log('in loop');
        console.log(k);
        htmltoappend = htmltoappend + '<tr class="row">' + '<td>' + k + '</td>';
        htmltoappend = htmltoappend+  '<td> + ' + result[k] + '</td></tr>';
      }
      htmltoappend=htmltoappend+'</table>';
      $('#inject_here4').append(htmltoappend);
    });

  }, 4000);
});
