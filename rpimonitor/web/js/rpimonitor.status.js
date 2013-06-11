$(function () {
var pages;
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

function showInfo(id,title,text){
  if ( text ) {
    postProcessInfo.push(["#"+id, title, text]);
    return "<a href='#' id='"+id+"'><i class='icon-search'></i>"
  }
}

function pad(n){
  return n<10 ? '0'+n : n
}

function plural(n){
  return n>1 ? 's ' : ' ' 
}

function uptime(value){
  uptimetext='';
  years = Math.floor(value / 31556926);
  rest = value % 31556926;    
  days = Math.floor( rest / 86400);
  rest = value % 86400;
  hours = Math.floor(rest / 3600);
  rest = value % 3600;
  minutes = Math.floor(rest / 60);
  seconds = Math.floor(rest % 60);
  if ( years != 0 ) { uptimetext += uptimetext + "<b>" + years + "</b> year" + plural(years) }
  if ( ( years != 0 ) || ( days != 0) ) { uptimetext += "<b>" + days +"</b> day" + plural(days)}
  if ( ( days != 0 ) || ( hours != 0) ) { uptimetext += "<b>" + pad(hours) +"</b> hour" + plural(hours)}
  uptimetext += "<b>" + pad(minutes) +"</b> minute" + plural(minutes);
  uptimetext += "<b>" + pad(seconds) +"</b> second"+plural(seconds)+"<p>"
  return uptimetext;
}

function kmg(value, initPre){
  unit = 1024;
  prefix = "kMGTPE";
  if (initPre){
    value *= Math.pow(unit,prefix.indexOf(initPre)+1);
  }
  try {
    if (value < unit) { return value + "B" };
    exp = Math.floor(Math.log(value) / Math.log(unit));
    pre = "kMGTPE".charAt(exp-1);
    return (value / Math.pow(unit, exp)).toFixed(2) + pre + "B";
  }
  catch (e) {
    return "Error"
  }
}

function percent(value,total){
  return (100*(total-value)/total).toFixed(2)+"%";
}

function progressbar(value, max){
  return "<div class='progress progress-striped'><div class='bar' style='width: "+((100 * value ) / max)+"%;'></div></div>"
}


var clocksec=0;
function clock(localtime){
  clocksec=localtime[5];
  return pad(localtime[3])+":"+pad(localtime[4])+"</b>:<b><span id='seconds'>" + pad(clocksec) + "</span></b>";
}

function tick(){
  clocksec++;
  if (clocksec == 60) { clocksec=0 };
  $('#seconds').html(pad(clocksec));
}

function ActivatePopover(){
  for ( var iloop=0; iloop < postProcessInfo.length; iloop++) {
    $(postProcessInfo[iloop][0]).popover({trigger:'hover',placement:'left',html:true, title: postProcessInfo[iloop][1], content: postProcessInfo[iloop][2] });
  }
  $("#packages").popover();

}

function UpdateStatus () {
  $.getJSON('stat/dynamic.json', function(data) {
    var static = localStorage.getItem('static');
    $.extend(data, eval('(' + static + ')'));
    
    $('#message').addClass('hide');
    
    for (var iloop=0; iloop < pages.length; iloop++){
      text = "";
      for (var jloop=0; jloop < pages[iloop].line.length; jloop++){
        var line = pages[iloop].line[jloop];
        text = text + "<p>"; 
        try {
          text = text + eval ( line );
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
      $('#message').html("<b>Can not get information (/stat/dynamic.json) from RPi-Monitor server.</b>");
      $('#message').removeClass('hide');
    });
  
}

function ConstructPage()
{
  $.getJSON('stat/status.json', function(data) {
    localStorage.setItem('status', JSON.stringify(data));
    for ( var iloop=0; iloop < data[0].content.length; iloop++) {
      $(RowTemplate(iloop,"img/"+data[0].content[iloop].icon,data[0].content[iloop].name)).insertBefore("#insertionPoint");
      pages=data[0].content;
    }
  })
  .fail(function() {
      $('#message').html("<b>Can not get information (stat/status.json) from RPi-Monitor server.</b>");
      $('#message').removeClass('hide');
    });

}

  /*set no cache */
  $.ajaxSetup({ cache: false });
  
  /* get static values once */
  $.getJSON('stat/static.json', function(data) {
    localStorage.setItem('static', JSON.stringify(data));
  })
  .fail(function() {
    $('#message').html("<b>Can not get information (stat/static.json) from RPi-Monitor server.</b>");
    $('#message').removeClass('hide');
  });

  /* construct page */
  ConstructPage();

  /* Start status update*/
  UpdateStatus();
  if ( statusautorefresh ) { 
    refreshTimerId = setInterval( UpdateStatus , 10000 ) 
    clockId=setInterval(tick,1000);
  }

});


