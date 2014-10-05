var shellinaboxwarning = false;

$(function () {
  $('#pagetitle').remove();

  resize_frame();
  
  options = '<hr>'+
            '<p>'+
              '<b>Shellinabox</b><br>'+
              '<form class="form-inline">'+
                '<input type="checkbox" id="shellinaboxwarning"> Show warning on page close or refresh'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#configurationInsertionPoint")
  
  shellinaboxwarning=(localStorage.getItem('shellinaboxwarning') === 'true' );
  $('#shellinaboxwarning').attr('checked', shellinaboxwarning );
  
  $('#shellinaboxwarning').click(function(){
    shellinaboxwarning = $('#shellinaboxwarning').is(":checked");
    localStorage.setItem('shellinaboxwarning', shellinaboxwarning);
  });
});

function resize_frame(){
  var window_height = $(window).height() - 100;
  $('#shellinaboxdiv').css('height',window_height+'px');
}

$(window).resize(function() {
  resize_frame();
});

window.onbeforeunload = function (e) {
  if ( !shellinaboxwarning ) return;
  e = e || window.event;
  message="Closing or refreshing this page will also close your connection.";
  if (e) {
    e.returnValue = message;
  }
  return message;
};
