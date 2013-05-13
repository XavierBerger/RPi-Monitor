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

var clocksec=0;
function clock(){
  clocksec++;
  if (clocksec == 60) { clocksec=0 };
  $('#seconds').html(pad(clocksec));
}

function UpdateStatus () {
  $.getJSON('/stat/rpimonitord.json', function(data) {
    $('#message').addClass('hide');

    // Uptime
    clocksec=data.localtime[5];
    uptimetext="<p>Raspberry Pi time: <b>" +  pad(data.localtime[3]) + "</b>:<b>" + pad(data.localtime[4]) +"</b>:<b><span id='seconds'>" + pad(clocksec) + "</span></b></p><p>";
    
    days = Math.round(data.uptime / 86400);
    rest = data.uptime % 86400;
    hours = Math.round(rest / 3600);
    rest = data.uptime % 3600;
    minutes = Math.round(rest / 60);
    seconds = Math.round(rest % 60);
    if ( days != 0 ) { uptimetext = uptimetext + "<b>" + days + "</b> days " }
    if ( ( days != 0 ) || ( hours != 0) )uptimetext += "<b>" + pad(hours) +"</b> hours "
    uptimetext += "<b>" + pad(minutes) +"</b> minutes "
    uptimetext += "<b>" + pad(seconds) +"</b> seconds<p>"
    $('#uptimeText').html(uptimetext);

    // temperature
    versionText="";
    if ( data.distribution ) {  versionText+="<p>Distribtion: <b>" + data.distribution + "</b></p>"}
    if ( data.kernel_version ) {  versionText+="<p>Kernel version: <b>" + data.kernel_version + "</b></p>"}
    if ( data.firmware_version ) {  versionText+="<p>Firmvare version: <b>" + data.firmware_version + "</b></p>"}
    if ( data.revision ) {  versionText+="<p>Revision: <b>" + data.revision + "</b></p>"}
    $('#versionText').html( versionText );

    // memory
    mempercent=100*(data.memory_total-data.memory_free)/data.memory_total;
    $('#memText').html(
      "<p>Used: <b>" + FormatSize(data.memory_total-data.memory_free)+" ("+mempercent.toFixed(2)+"%)</b>"+
      " Free: <b>"   + FormatSize(data.memory_free)+"</b>"+
      " Total: <b>"  + FormatSize(data.memory_total)+"</b></p>"+
      "<div class='progress progress-striped'><div class='bar' style='width: "+mempercent+"%;'></div></div>");

    // cpu
    cpuText=""
    cpuText+="<p>Load: 1 Min: <b>" + data.load1 + "</b> - 5 Min: <b>" + data.load5 +"</b> - 15 Min: <b>" + data.load15 + "</b>"
    cpuText+="<p>CPU frequency: <b>"+ (data.cpu_frequency / 1000)+"MHz</b> "
    if ( data.voltage ) { cpuText+="Voltage: <b>" +data.voltage+"V</b>" }
    cpuText+="</p>"
    $('#cpuText').html( cpuText );

    // temperature
    $('#tempText').html(
      "CPU temperature: <b>" + (data.soc_temp/1000).toFixed(2) + "°C</b>"
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
      "</b> Recieved: <b>" +
      FormatSize(data.net_recived/1024) + " <i class='icon-arrow-down'></i></b>"
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

$(function () {
  /* set no cache */
  $.ajaxSetup({ cache: false });
  
  /* Start status update*/
  UpdateStatus();
  if ( statusautorefresh ) { 
    refreshtimer = setInterval( UpdateStatus , 10000 ) 
  }

  setInterval(clock,1000);
  
});


