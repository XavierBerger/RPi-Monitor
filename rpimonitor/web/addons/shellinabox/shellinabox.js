var shellinaboxwarning = false;
var shellinaboxuri;

$(function () {
  $('#pagetitle').remove();

  resize_frame();
  
  options = '<hr>'+
            '<p>'+
              '<b>Shellinabox</b><br>'+
              '<form class="form-inline">'+
                'Shellinabox url: '+
                '<div class="input-group">'+
                  '<input type="text" class="form-control" id="shellinaboxuri">'+
                  '<span class="input-group-btn">'+
                    '<button id="defaulturi" class="btn" type="button">Default</button>'+
                  '</span>'+
                '</div><br>'+
                '<input type="checkbox" id="shellinaboxwarning"> Show warning on page close or refresh'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  
  
  $("#defaulturi").click(function(){
    shellinaboxuri = "/shellinabox";
    $('#shellinaboxuri').val(shellinaboxuri);
    localStorage.setItem('shellinaboxuri', shellinaboxuri);
    $("#shellinaboxframe").attr('src', shellinaboxuri);
  });

  shellinaboxwarning=(localStorage.getItem('shellinaboxwarning') === 'true' );
  $('#shellinaboxwarning').attr('checked', shellinaboxwarning );
  
  $('#shellinaboxwarning').click(function(){
    shellinaboxwarning = $('#shellinaboxwarning').is(":checked");
    localStorage.setItem('shellinaboxwarning', shellinaboxwarning);
  });

  shellinaboxuri=(localStorage.getItem('shellinaboxuri') || '/shellinabox');
  $('#shellinaboxuri').val(shellinaboxuri);
  $('#shellinaboxuri').keyup(function(){
    shellinaboxuri = $('#shellinaboxuri').val();
    localStorage.setItem('shellinaboxuri', shellinaboxuri);
    $("#shellinaboxframe").attr('src', shellinaboxuri);
  });
  
  $("#shellinaboxframe").attr('src', shellinaboxuri);
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
