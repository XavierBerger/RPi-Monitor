$(function () {

  function FormatSize(size){
    if ( size < 1048576 ) {
      return ( size / 1024 ).toFixed(2)+"MB";
    }
    else{
      return ( size / 1024 / 1024 ).toFixed(2) +"GB";
    }
  }

  /* set no cache */
  $.ajaxSetup({ cache: false });

  $.getJSON('/stat/rpimonitord.json', function(data) {
    // Uptime
    hour = Math.round(data.uptime / 3600);
    rest = data.uptime % 3600;
    minutes = Math.round(rest / 60);
    seconds = Math.round(rest % 60);
    $('#uptimeText').html("<b>" + hour+"</b> hours <b>" + minutes + "</b> minutes <b>" + seconds + "</b> seconds");

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
    if ( data.voltage ) { cpuText+="Voltage: <b>" +(data.voltage  / 1000000)+"V</b>" }
    cpuText+="</p>"
    $('#cpuText').html( cpuText );

    // temperature
    $('#tempText').html(
      "CPU temperature: <b>" + Math.round(data.soc_temp/1000) + "°C</b>"
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

  }).fail(function() {
      $('#message').html("<b>Can not get status information. Is rpimonitord.conf correctly configured on server?</b>");
      $('#message').removeClass('hide');
    });

});
