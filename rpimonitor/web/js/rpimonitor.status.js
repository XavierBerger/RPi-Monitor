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
var justgageId=0;
var postProcessCommand=[];

function RowTemplate(id,image,title){
  return ""+
        "<div class='row row"+id+"'>"+
          "<div class='Title'><img src='"+image+"' alt='"+title+"'> &nbsp;"+title+"</div>"+
          //"<div class='Icon'><img src='"+image+"' alt='"+title+"'></div>"+
          //"<div class='Title'>"+title+"</div>"+
          //"<div class='Warning'></div>"+
          "<div class='Text' id='Text"+id+"'><b></b></div>"+
        "</div>"+
        "<hr class='row"+id+"'>"
}

function ShowInfo(id,title,text){
  if ( text ) {
    postProcessInfo.push(["#"+id, title, text]);
    return " <a href='#' id='"+id+"'><font color=black><span class='glyphicon glyphicon-search'></font></span>"
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

function ProgressBar(value, max, warning, danger){
  var percent = ((100 * value ) / max).toFixed(2)
  var warning = warning || max 
  var danger = danger || max
  var color = ''
  if (percent > warning) {
  color = 'progress-bar-warning'
  }
  if (percent > danger) {
  color = 'progress-bar-danger'
  }
  return "<div class='progress'><div class='progress-bar "+color+"' role='progressbar' aria-valuemin='0' aria-valuemax='100' aria-valuenow='"+percent+"' style='width: "+percent+"%;'>"+percent+"%</div></div>"
}

function JustGageBar(title, label,min, value, max, width, height){
  width= width || 100
  height= height || 80
  justgageId++

  div="<div class='justgage' id='gauge"+(justgageId)+"' style='width:"+width+"px; height:"+height+"px;'></div>"
  postProcessCommand.push('var g = new JustGage({'+
    'id: "gauge'+(justgageId)+'",'+
    'value: '+value+','+
    'min: '+min+','+
    'max: '+max+','+
    'label: "'+label+'",'+
    'title: "'+title+'" })')
    
  return div
}

function Label(data,formula, text, level){
  var result="";
  if ( level.indexOf('label-') < 0 ) { level = 'label-'+level };
  eval ( "if ("+data+formula+") result=\"<span class='label "+level+"'>"+text+"</span>\"" );
  return result;
}

function Badge(data,formula, text, level){
  var result="";
  if ( level.indexOf('alert-') < 0 ) { level = 'alert-'+level };
  eval ( "if ("+data+formula+") result=\"<span class='badge "+level+"'>"+text+"</span>\"" );
  return result;
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
    $(postProcessInfo[iloop][0]).popover({trigger:'hover',placement:'bottom',html:true, title: postProcessInfo[iloop][1], content: postProcessInfo[iloop][2] });
  }
  $("#packages").popover();
}

function UpdateStatus () {
  $.getJSON('dynamic.json', function(data) {
    var static = localStorage.getItem('static');
    $.extend(data, eval('(' + static + ')'));

    $('#message').addClass('hide');

    for (var iloop=0; iloop < strips.length; iloop++){
      eval( 'visibility = '+strips[iloop].visibility ) 
      if ( visibility == 0) {
        $('.row'+iloop).addClass('hide')
      }
      else {
        $('.row'+iloop).removeClass('hide')
      }
      text = "";
      for (var jloop=0; jloop < strips[iloop].line.length; jloop++){
        var line = strips[iloop].line[jloop];
        text = text + "<p>";
        try {
            text = text + eval( line );
        }
        catch (e) {
          text = text + "ERROR: " + line + " -> " + e;
        }
        finally {
          text = text + "</p>";
        }
      }
      $("#Text"+iloop).html(text);    
    }
    
    while((command=postProcessCommand.pop()) != null) {
      eval( command )
    }
    
    ActivatePopover();

  })
  .fail(function() {
      $('#message').html("<span class='glyphicon glyphicon-warning-sign'></span> &nbsp; Can not get information (dynamic.json) from <b>RPi-Monitor</b> server.");
      $('#message').removeClass('hide');
    });

}

function ConstructPage()
{
  var activePage = GetURLParameter('activePage');

  if ( typeof activePage == 'undefined') {
    activePage=localStorage.getItem('activePage', activePage);
    if ( activePage ==null ) { activePage = 0 }
  };
  data = getData('status');
  if ( activePage >= data.length ){
    activePage=0;
  }
  localStorage.setItem('activePage', activePage);
  if ( data.length > 1 ) {
    $('<h2><p class="text-info">'+data[activePage].name+'</p></h2><hr>').insertBefore("#insertionPoint");
  }
  for ( var iloop=0; iloop < data[activePage].content.length; iloop++) {
    $(RowTemplate(iloop,"img/"+data[activePage].content[iloop].icon,data[activePage].content[iloop].name)).insertBefore("#insertionPoint");
    strips=data[activePage].content;
  }
  UpdateStatus();
}

$(function () {
  /* Set no cache */
  $.ajaxSetup({ cache: false });

  /* Show friends */
  ShowFriends();

  /* Add qrcode shortcut*/
  setupqr();
  doqr(document.URL);

  /* Get static values once */
  data = getData('static');
  localStorage.setItem('static', JSON.stringify(data));
  ConstructPage();

  if ( statusautorefresh ) {
    refreshTimerId = setInterval( UpdateStatus , 10000 )
    clockId=setInterval(Tick,1000);
  }

});


