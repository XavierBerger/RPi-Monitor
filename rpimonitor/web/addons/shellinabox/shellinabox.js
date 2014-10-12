var shellinaboxwarning = true;
var shellinaboxuri;
var activePage = GetURLParameter('activePage');


$(function () {
  $('#pagetitle').remove();

  resize_frame();
  
  options = '<p>'+
              '<b>Shellinabox</b><br>'+
              '<form class="form-inline">'+
                'Shellinabox url: '+
                '<div class="input-group">'+
                  '<input type="text" class="form-control" id="shellinaboxuri'+activePage+'">'+
                  '<span class="input-group-btn">'+
                    '<button id="defaulturi" class="btn" type="button">Default</button>'+
                  '</span>'+
                '</div><br>'+
                '<input type="checkbox" id="shellinaboxwarning'+activePage+'"> Show warning on page close or refresh'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  
  
  $("#defaulturi").click(function(){
    shellinaboxuri = "/shellinabox";
    $('#shellinaboxuri'+activePage).val(shellinaboxuri);
    localStorage.setItem('shellinaboxuri'+activePage, shellinaboxuri);
    $("#shellinaboxframe").attr('src', shellinaboxuri);
  });

  shellinaboxwarning=(localStorage.getItem('shellinaboxwarning'+activePage) === 'true' );
  $('#shellinaboxwarning'+activePage).attr('checked', shellinaboxwarning );
  
  $('#shellinaboxwarning'+activePage).click(function(){
    shellinaboxwarning = $('#shellinaboxwarning'+activePage).is(":checked");
    localStorage.setItem('shellinaboxwarning'+activePage, shellinaboxwarning);
  });

  shellinaboxuri=(localStorage.getItem('shellinaboxuri'+activePage) || '/shellinabox');
  $('#shellinaboxuri'+activePage).val(shellinaboxuri);
  $('#shellinaboxuri'+activePage).keyup(function(){
    shellinaboxuri = $('#shellinaboxuri'+activePage).val();
    localStorage.setItem('shellinaboxuri'+activePage, shellinaboxuri);
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
