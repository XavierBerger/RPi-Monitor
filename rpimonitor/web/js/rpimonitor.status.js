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

function uptime(input){
  return input;
}

function kmg(input){
  return input;
}


var clocksec=0;
function clock(){
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
        text = text + "<p>" + eval ( line ) + "</p>";
      }
      $("#Text"+iloop).html(text);
    }
    
    return;
    
    // Uptime
    clocksec=data.localtime[5];
    uptimetext="<p>Raspberry Pi time: <b>" +  pad(data.localtime[3]) + "</b>:<b>" + pad(data.localtime[4]) +"</b>:<b><span id='seconds'>" + pad(clocksec) + "</span></b></p><p>";

    years = Math.floor(data.uptime / 31556926);
    rest = data.uptime % 31556926;    
    days = Math.floor( rest / 86400);
    rest = data.uptime % 86400;
    hours = Math.floor(rest / 3600);
    rest = data.uptime % 3600;
    minutes = Math.floor(rest / 60);
    seconds = Math.floor(rest % 60);
    if ( years != 0 ) { uptimetext += uptimetext + "<b>" + years + "</b> year" + plural(years) }
    if ( ( years != 0 ) || ( days != 0) ) { uptimetext += "<b>" + days +"</b> day" + plural(days)}
    if ( ( days != 0 ) || ( hours != 0) ) { uptimetext += "<b>" + pad(hours) +"</b> hour" + plural(hours)}
    uptimetext += "<b>" + pad(minutes) +"</b> minute" + plural(minutes);
    uptimetext += "<b>" + pad(seconds) +"</b> second"+plural(seconds)+"<p>"
    $('#Text2').html(uptimetext);

    // version
    versionText="";
    if ( data.processor ) {  versionText+="<p>Processor: <b>" + data.processor + "</b></p>"}
    if ( data.distribution ) {  versionText+="<p>Distribtion: <b>" + data.distribution + "</b></p>"}
    if ( data.kernel_version ) {  versionText+="<p>Kernel version: <b>" + data.kernel_version + "</b></p>"}
    if ( data.firmware_version ) {  versionText+="<p>Firmvare version: <b>" + data.firmware_version + "</b></p>"}
    if ( data.revision ) {  versionText+="<p>Revision: <b>" + data.revision + "</b></p>"}
    if ( data.upgrade ) {
      versionText+="<p>Packages in repository to be: <b>" + data.upgrade + 
                 "</b> <a href='#' id='packages'><i class='icon-search'></i></p>";
    }  
    $('#versionText').html( versionText );

    if ( data.packages ){
      $('#packages').removeClass('hide');
      $('#packages').popover({trigger:'hover',placement:'left',html:true, title: "Upgradable packages", content:data.packages });
    }
    else {
      $('#packages').addClass('hide');
    }


    // memory
    mempercent=100*(data.memory_total-data.memory_free)/data.memory_total;
    $('#memText').html(
      "<p>Used: <b>" + FormatSize(data.memory_total-data.memory_free)+" ("+mempercent.toFixed(2)+"%)</b>"+
      " Free: <b>"   + FormatSize(data.memory_free)+"</b>"+
      " Total: <b>"  + FormatSize(data.memory_total)+"</b></p>"+
      "<div class='progress progress-striped'><div class='bar' style='width: "+mempercent+"%;'></div></div>");

    // cpu
    cpuText=""
    cpuText+="<p>Loads: <b>" + data.load1 + "</b> [1min] - <b>" + data.load5 +"</b> [5min] - <b>" + data.load15 + "</b> [15min]</p>"
    cpuText+="<p>CPU frequency: <b>"+ (data.cpu_frequency / 1000)+"MHz</b> "
    if ( data.voltage ) { cpuText+="Voltage: <b>" +data.voltage+"V</b>" }
    cpuText+="</p>"
    if ( data.scaling_governor ) { cpuText+="<p>Scaling governor: <b>" +data.scaling_governor+"</b></p>" }
    $('#cpuText').html( cpuText );

    // temperature
    $('#tempText').html(
      "CPU temperature: <b>" + (data.soc_temp/1000).toFixed(2) + "&deg;C</b>"
    );

    // swap
    if ( data.swap_total ) {
      swappercent=100*(data.swap_total-data.swap_free)/data.swap_total;
      $('#swapText').html(
        "<p>Used: <b>"+ FormatSize(data.swap_total-data.swap_free) + " ("+swappercent.toFixed(2)+"%)</b>"+
        " Free: <b>"  + FormatSize(data.swap_free)                 + "</b>"+
        " Total: <b>" + FormatSize(data.swap_total)                + "</b></p>"+
        "<div class='progress progress-striped " + ( animate ? "active" : "") +"'><div class='bar' style='width: "+swappercent+"%;'></div></div>"
      );
    }

    // sd
    var diskText=""
    var disk_name=["/home","/","/boot"];
    var disk_total=[data.sdcard_home_total,data.sdcard_root_total,data.sdcard_boot_total];
    var disk_free=[data.sdcard_home_free,data.sdcard_root_free,data.sdcard_boot_free];
    for (iloop=0;iloop<disk_total.length;iloop++){
      if ( disk_total[iloop] ){
        percent=100*(disk_total[iloop]-disk_free[iloop])/disk_total[iloop];
        diskText+="<p><b>"      + disk_name[iloop] + "</b> used: <b>" + FormatSize(disk_total[iloop]-disk_free[iloop])+" ("+percent.toFixed(2)+"%)</b>"
        diskText+=" Free: <b>"  + FormatSize(disk_free[iloop])  + "</b>"
        diskText+=" Total: <b>" + FormatSize(disk_total[iloop]) + "</b></p>"
        diskText+="<div class='progress progress-striped " + ( animate ? "active" : "") +"'><div class='bar' style='width: "+percent+"%;'></div></div>"
      }
    }
    $('#sdText').html( diskText );

    // network
    $('#netText').html(
      "Ethernet Sent: <b>" +
      FormatSize(data.net_send/1024) + " <i class='icon-arrow-up'></i>"+
      "</b> Received: <b>" +
      FormatSize(data.net_received/1024) + " <i class='icon-arrow-down'></i></b>"
    );

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
    clockId=setInterval(clock,1000);
  }

});


