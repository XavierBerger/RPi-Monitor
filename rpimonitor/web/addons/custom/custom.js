var customwarning = true;
var customuri;
var activePage = GetURLParameter('activePage');


$(function () {
  $('#pagetitle').remove();

  resize_frame();
  
  options = '<p>'+
              '<b>Custom</b><br>'+
              '<form class="form-inline">'+
                'Custom url: '+
                '<div class="input-group">'+
                  '<input type="text" class="form-control" id="customuri'+activePage+'">'+
                  '</div><br>'+
                '<input type="checkbox" id="customwarning'+activePage+'"> Show warning on page close or refresh'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  
  
  $("#defaulturi").click(function(){
    customuri = "/custom";
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

  customuri=(localStorage.getItem('customuri'+activePage) || '/addons/custom/custominfo.html');
  $('#customuri'+activePage).val(customuri);
  $('#customuri'+activePage).keyup(function(){
    customuri = $('#customuri'+activePage).val();
    localStorage.setItem('customuri'+activePage, customuri);
    $("#customframe").attr('src', customuri);
  });
  
  $("#customframe").attr('src', customuri);
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
