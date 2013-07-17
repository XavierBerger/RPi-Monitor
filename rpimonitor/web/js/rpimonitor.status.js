// This file is part of RPi-Monitor project
//
// Copyright 2013 - Xavier Berger - http://rpi-experiences.blogspot.fr/
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
var strips;
var postProcessInfo=[];

function RowTemplate(id,image,title){
  return ""+
        "<div class='row'>"+
          "<div class='Icon'><img src='"+image+"' alt='"+title+"'></div>"+
          "<div class='Title'>"+title+"</div>"+
          "<div class='Warning'></div>"+
          "<div class='Text' id='Text"+id+"'><b></b></div>"+
        "</div>"+
        "<hr>"
}

function ShowInfo(id,title,text){
  if ( text ) {
    postProcessInfo.push(["#"+id, title, text]);
    return "<a href='#' id='"+id+"'><i class='icon-search'></i>"
  }
  else {
    return "";
  }
}

function Pad(n){
  return n<10 ? '0'+n : n
}

function Plural(n){
  return n>1 ? 's ' : ' ' 
}

function Uptime(value){
  uptimetext='';
  years = Math.floor(value / 31556926);
  rest = value % 31556926;    
  days = Math.floor( rest / 86400);
  rest = value % 86400;
  hours = Math.floor(rest / 3600);
  rest = value % 3600;
  minutes = Math.floor(rest / 60);
  seconds = Math.floor(rest % 60);
  if ( years != 0 ) { uptimetext += uptimetext + "<b>" + years + "</b> year" + Plural(years) }
  if ( ( years != 0 ) || ( days != 0) ) { uptimetext += "<b>" + days +"</b> day" + Plural(days)}
  if ( ( days != 0 ) || ( hours != 0) ) { uptimetext += "<b>" + Pad(hours) +"</b> hour" + Plural(hours)}
  uptimetext += "<b>" + Pad(minutes) +"</b> minute" + Plural(minutes);
  uptimetext += "<b>" + Pad(seconds) +"</b> second" + Plural(seconds)+"<p>"
  return uptimetext;
}

function KMG(value, initPre){
  unit = 1024;
  prefix = "kMGTPE";
  if (initPre){
    value *= Math.pow(unit,prefix.indexOf(initPre)+1);
  }
  try {
    if (Math.abs(value) < unit) { return value + "B" };
    exp = Math.floor(Math.log(Math.abs(value)) / Math.log(unit));
    pre = prefix.charAt(exp-1);
    return (value / Math.pow(unit, exp)).toFixed(2) + pre + "B";
  }
  catch (e) {
    return "Error"
  }
}

function Percent(value,total){
  return (100*value/total).toFixed(2)+"%";
}

function ProgressBar(value, max){
  return "<div class='progress progress-striped'><div class='bar' style='width: "+((100 * value ) / max)+"%;'></div></div>"
}

var clocksec=0;
function Clock(localtime){
  clocksec=localtime[5];
  return Pad(localtime[3])+":"+Pad(localtime[4])+"</b>:<b><span id='seconds'>" + Pad(clocksec) + "</span></b>";
}

function Tick(){
  clocksec++;
  if (clocksec == 60) { clocksec=0 };
  $('#seconds').html(Pad(clocksec));
}

function ActivatePopover(){
  for ( var iloop=0; iloop < postProcessInfo.length; iloop++) {
    $(postProcessInfo[iloop][0]).popover({trigger:'hover',placement:'left',html:true, title: postProcessInfo[iloop][1], content: postProcessInfo[iloop][2] });
  }
  $("#packages").popover();
}

function UpdateStatus () {
  $.getJSON('dynamic.json', function(data) {
    var static = localStorage.getItem('static');
    $.extend(data, eval('(' + static + ')'));
    
    $('#message').addClass('hide');
    
    for (var iloop=0; iloop < strips.length; iloop++){
      text = "";
      for (var jloop=0; jloop < strips[iloop].line.length; jloop++){
        var line = strips[iloop].line[jloop];
        text = text + "<p>"; 
        try {
            text = text + eval( line ); 
    }
        catch (e) {
          text = text + "ERROR: " + line;
        }
        finally {
          text = text + "</p>";
        }
      }
      $("#Text"+iloop).html(text);
    }
    
    SetProgressBarAnimate();
    ActivatePopover();
    
    if ( firstload == true ){
      firstload=false;
      ShowFriends(data.friends);
    }

  })
  .fail(function() {
      $('#message').html("<b>Can not get information (dynamic.json) from RPi-Monitor server.</b>");
      $('#message').removeClass('hide');
    });
  
}

function ConstructPage()
{
  var activePage = GetURLParameter('activePage');
  if ( typeof activePage == 'undefined') { activePage=0 };
  $.getJSON('status.json', function(data) {
    localStorage.setItem('status', JSON.stringify(data));
    for ( var iloop=0; iloop < data[activePage].content.length; iloop++) {
      $(RowTemplate(iloop,"img/"+data[activePage].content[iloop].icon,data[activePage].content[iloop].name)).insertBefore("#insertionPoint");
      strips=data[activePage].content;
    }
    UpdateStatus();
  })
  .fail(function() {
      $('#message').html("<b>Can not get information (status.json) from RPi-Monitor server.</b>");
      $('#message').removeClass('hide');
  });

}

$(function () {
  /* Set no cache */
  $.ajaxSetup({ cache: false });

  /* Show friends */
  ShowFriends();

  /* Get static values once */
  $.getJSON('static.json', function(data) {
    localStorage.setItem('static', JSON.stringify(data));
    ConstructPage();

  })
  .fail(function() {
    $('#message').html("<b>Can not get information (static.json) from RPi-Monitor server.</b>");
    $('#message').removeClass('hide');
  });

  if ( statusautorefresh ) { 
    refreshTimerId = setInterval( UpdateStatus , 10000 ) 
    clockId=setInterval(Tick,1000);
  }

});


