var activePage = GetURLParameter('activePage');
if (activePage == null){ activePage = 0; }

function UpdateAddon () {
  $.getJSON('dynamic.json', function(data) {
    // Concatenate dynamic.json and static.json into data variable
    $.extend(data, getData('static'));
    
    //ADD YOUR JAVASCRIPT HERE
    //Example using data from RPi-Monitor and function provided by rpimonitor.utils.js
    textToDisplay = "Uptime: " + Uptime(data.uptime);
    $("#addonInsertionPoint").html(textToDisplay)
    
  })
}

$(function () {
  alert('Example addons is showing how to dynamically display Raspberry Pi uptime.\n'+
        'Have a look to "addonInsertionPoint" bellow and click OK')
  
  options = '<p>'+
              '<b>Example</b><br>'+
              '<form class="form-inline">'+
                '<input type="checkbox" id="shellinaboxwarning"> Add addons option(s)'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  UpdateAddon();
  
  //if ( statusautorefresh ) {
  //  refreshTimerId = setInterval( UpdateAddon , 10000 )
  //  clockId=setInterval(Tick,1000);
  //}
  
});


