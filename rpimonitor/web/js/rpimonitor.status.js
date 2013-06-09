var pages;

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

function FormatSize(size){
  if ( size < 1048576 ) {
    return ( size / 1024 ).toFixed(2)+"MB";
  }
  else{
    return ( size / 1024 / 1024 ).toFixed(2) +"GB";
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

function kmg(value){
  unit = 1024;
  try {
    if (value < unit) { return value + " B" };
    exp = Math.floor(Math.log(value) / Math.log(unit));
    pre = "kMGTPE".charAt(exp);
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
  return "<div class='progress progress-striped'><div class='bar' style='width: "+((100 * ( max - value )) / max)+"%;'></div></div>"
}


var clocksec=0;
function clock(localtime){
  clocksec=localtime[5];
  return localtime[3]+":"+localtime[4]+"</b>:<b><span id='seconds'>" + pad(clocksec) + "</span></b>";
}

function tick(){
  clocksec++;
  if (clocksec == 60) { clocksec=0 };
  $('#seconds').html(pad(clocksec));
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
    
    if ( firstload == true ){
      firstload=false;
      ShowFriends(data.friends);
    }

  })
  .fail(function() {
      $('#message').html("<b>Can not get status information. Is rpimonitord.conf correctly configured on server? Is server running?</b>");
      $('#message').removeClass('hide');
    });
  
}

function ConstructPage()
{
  $.getJSON('web.json', function(data) {
    localStorage.setItem('web', JSON.stringify(data));
    for ( var iloop=0; iloop < data.status[0].content.length; iloop++) {
      $(RowTemplate(iloop,"img/"+data.status[0].content[iloop].icon,data.status[0].content[iloop].name)).insertBefore("#insertionPoint");
      pages=data.status[0].content;
    }
  })
  .fail(function() {
      $('#message').html("<b>Can not get status information. Is rpimonitord.conf correctly configured on server? Is server running?</b>");
      $('#message').removeClass('hide');
    });

}

$(function () {
  /*set no cache */
  $.ajaxSetup({ cache: false });
  
  /* get static values once */
  $.getJSON('stat/static.json', function(data) {
    localStorage.setItem('static', JSON.stringify(data));
  })

  /* construct page */
  ConstructPage();

  $("#packages").popover();
  
  /* Start status update*/
  UpdateStatus();
  if ( statusautorefresh ) { 
    refreshTimerId = setInterval( UpdateStatus , 10000 ) 
    clockId=setInterval(tick,1000);
  }

});


