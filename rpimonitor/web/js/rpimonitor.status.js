$(function () {
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
      "<p>Used: <b>"+Math.round((data.memory_total-data.memory_free)/ 1024)+"MB ("+Math.round(mempercent)+"%)</b>"+
      " Free: <b>"+Math.round(data.memory_free/ 1024)+"MB</b>"+
      " Total: <b>"+Math.round(data.memory_total/ 1024)+"MB</b></p>"+
      "<div class='progress progress-striped active'><div class='bar' style='width: "+mempercent+"%;'></div></div>");

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
        "<p>Used: <b>"+Math.round((data.swap_total-data.swap_free)/ 1024)+"MB ("+Math.round(swappercent)+"%)</b>"+
        " Free: <b>"+Math.round(data.swap_free/ 1024)+"MB</b>"+
        " Total: <b>"+Math.round(data.swap_total/ 1024)+"MB</b></p>"+
        "<div class='progress progress-striped active'><div class='bar' style='width: "+swappercent+"%;'></div></div>"
      );
    }

    // sd
    var diskText=""
    var disk_name=["/home","/","/boot"];
    var disk_total=[data.sdcard_home_total,data.sdcard_root_total,data.sdcard_boot_total];
    var disk_free=[data.sdcard_home_free,data.sdcard_root_free,data.sdcard_boot_free];
    for (iloop=0;iloop<disk_total.length;iloop++){
      if ( disk_total ){
        percent=100*(disk_total[iloop]-disk_free[iloop])/disk_total[iloop];
        diskText+="<p><b>"+disk_name[iloop]+"</b> used: <b>"+Math.round((disk_total[iloop]-disk_free[iloop])/ 1024)+"MB ("+Math.round(percent)+"%)</b>"
        diskText+=" Free: <b>"+Math.round(disk_free[iloop]/ 1024)+"MB</b>"
        diskText+=" Total: <b>"+Math.round(disk_total[iloop]/ 1024)+"MB</b></p>"
        diskText+="<div class='progress progress-striped active'><div class='bar' style='width: "+percent+"%;'></div></div>"
      }
    }
    $('#sdText').html( diskText );
/*
    homepercent=100*(data.sdcard_home_total-data.sdcard_home_free)/data.sdcard_home_total;
    rootpercent=100*(data.sdcard_root_total-data.sdcard_root_free)/data.sdcard_root_total;
    bootpercent=100*(data.sdcard_boot_total-data.sdcard_boot_free)/data.sdcard_boot_total;
    $('#sdText').html(
      "<p><b>/boot</b> used: <b>"+Math.round((data.sdcard_boot_total-data.sdcard_boot_free)/ 1024)+"MB ("+Math.round(bootpercent)+"%)</b>"+
      " Free: <b>"+Math.round(data.sdcard_boot_free/ 1024)+"MB</b>"+
      " Total: <b>"+Math.round(data.sdcard_boot_total/ 1024)+"MB</b></p>"+
      "<div class='progress progress-striped active'><div class='bar' style='width: "+bootpercent+"%;'></div></div>"+
      "<p><b>/</b> used: <b>"+Math.round((data.sdcard_root_total-data.sdcard_root_free)/ 1024)+"MB ("+Math.round(rootpercent)+"%)</b>"+
      " Free: <b>"+Math.round(data.sdcard_root_free/ 1024)+"MB</b>"+
      " Total: <b>"+Math.round(data.sdcard_root_total/ 1024)+"MB</b></p>"+
      "<div class='progress progress-striped active'><div class='bar' style='width: "+rootpercent+"%;'></div></div>"+
      "<p><b>/home</b> used: <b>"+Math.round((data.sdcard_home_total-data.sdcard_home_free)/ 1024)+"MB ("+Math.round(homepercent)+"%)</b>"+
      " Free: <b>"+Math.round(data.sdcard_home_free/ 1024)+"MB</b>"+
      " Total: <b>"+Math.round(data.sdcard_home_total/ 1024)+"MB</b></p>"+
      "<div class='progress progress-striped active'><div class='bar' style='width: "+homepercent+"%;'></div></div>"
    );
*/
    // network
    $('#netText').html(
      "Ethernet Sent: <b>" +
      (data.net_send/1024/1024).toFixed(3) + "MB <i class='icon-arrow-up'></i>"+
      "</b> Recieved: <b>" +
      (data.net_recived/1024/1024).toFixed(3) + "MB <i class='icon-arrow-down'></i></b>"
    );
  }).fail(function() {
      $('#message').html("<b>Can not get status information. Is rpimonitord.conf correctly configured on server?</b>");
      $('#message').removeClass('hide');
    });
});
