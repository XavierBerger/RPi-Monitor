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
  var warning = warning || 0
  var danger = danger || 0
  var color = ''
  if (danger > warning) {
    if (percent > warning) {
      color = 'progress-bar-warning'
    }
    if (percent > danger) {
      color = 'progress-bar-danger'
    }
  }
  else {
    if (percent < warning) {
      color = 'progress-bar-warning'
    }
    if (percent < danger) {
      color = 'progress-bar-danger'
    }
  }
  return "<div class='progress'><div class='progress-bar "+color+"' role='progressbar' aria-valuemin='0' aria-valuemax='100' aria-valuenow='"+percent+"' style='width: "+percent+"%;'>"+percent+"%</div></div>"
}

function JustGageBar(title, label,min, value, max, width, height, levelColors, warning, critical){
  width= width || 100
  height= height || 80
  levelColors = levelColors || percentColors
  if (( warning != undefined ) && (critical != undefined)){
    if ( value > critical ) {
      levelColors = [levelColors[2], levelColors[2], levelColors[2]];
    } else
    if ( value > warning ) {
      levelColors = [levelColors[1], levelColors[1], levelColors[1]];
    } else {
      levelColors = [levelColors[0], levelColors[0], levelColors[0]];
    }
  }

  justgageId++

  div="<div class='justgage' id='gauge"+(justgageId)+"' style='width:"+width+"px; height:"+height+"px;'></div>"
  postProcessCommand.push('var g = new JustGage({'+
    'id: "gauge'+(justgageId)+'",'+
    'value: '+value+','+
    'min: '+min+','+
    'max: '+max+','+
    'label: "'+label+'",'+
    'title: "'+title+'",'+
    'startAnimationTime: 1,'+
    'startAnimationType: "linear",'+
    'levelColors: ["'+ levelColors[0] +'","'+levelColors[1] +'","'+levelColors[2] +'"]'+
    '})')
  return div
}

function Label(data,formula, text, level){
  var result="";
  if ( level.indexOf('label-') < 0 ) { level = 'label-'+level };
  if ( isNaN(data) ) { data = "\""+data+"\"" };
  eval ( "if ("+data+formula+") result=\"<span class='label "+level+"'>"+text+"</span>\"" );
  return result;
}

function Badge(data,formula, text, level){
  var result="";
  if ( level.indexOf('alert-') < 0 ) { level = 'alert-'+level };
  if ( isNaN(data) ) { data = "\""+data+"\"" };
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

var result=""
function InsertHTML( url ){
   $.ajax({
      url: url,
      async:false,
      success: function(data) {
        result = data
      }
    })
    return result
}


