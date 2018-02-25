var customwarning = true;
var customuri;
var activePage = GetURLParameter('activePage');
if (activePage == null){ activePage = 0; }

$(function () {
  resize_frame();
  
  data = getData('addons');
  
  options = '<p>'+
              '<b>Custom addons</b><br>'+
              '<form class="form-inline">'
  if (data[activePage].allowupdate || true ) {
    options =   'Custom url: '+
                '<div class="input-group" style="width:465px">'+
                  '<input type="text" class="form-control" id="customuri'+activePage+'">'+
                  '<span class="input-group-btn">'+
                    '<button id="defaulturi" class="btn" type="button">Default</button>'+
                  '</span>'+
                '</div><br>'
  } 
  options =     '<input type="checkbox" id="customwarning'+activePage+'"> Show warning on page close or refresh'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  
  $("#defaulturi").click(function(){
    customuri = data[activePage].url;//"/addons/custom/custominfo.html";
    $('#customuri'+activePage).val(customuri);
    localStorage.setItem('customuri'+activePage, customuri);
    $("#customframe").attr('src', customuri);
  });

  customwarning=(localStorage.getItem('customwarning'+activePage) === 'true' );
  $('#customwarning'+activePage).attr('checked', customwarning );
  
  $('#customwarning'+activePage).click(function(){
    customwarning = $('#customwarning'+activePage).is(":checked");
    localStorage.setItem('customwarning'+activePage, customwarning);
  });

  if (data[activePage].allowupdate || true ) {
  customuri=(localStorage.getItem('customuri'+activePage) || data[activePage].url || '/addons/custom/custominfo.html');
  $('#customuri'+activePage).val(customuri);
  $('#customuri'+activePage).keyup(function(){
    customuri = $('#customuri'+activePage).val();
    localStorage.setItem('customuri'+activePage, customuri);
    $("#customframe").attr('src', customuri);
  });
  
  $("#customframe").attr('src', customuri);
  }
});

function resize_frame(){
  var window_height = $(window).height() - 100;
  $('#customdiv').css('height',window_height+'px');
}

$(window).resize(function() {
  resize_frame();
});

window.onbeforeunload = function (e) {
  if ( !customwarning ) return;
  e = e || window.event;
  message="Closing or refreshing this page will also close your connection.";
  if (e) {
    e.returnValue = message;
  }
  return message;
};
