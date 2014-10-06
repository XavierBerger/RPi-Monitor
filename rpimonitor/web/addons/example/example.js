$(function () {
  alert('Example addons javascript')
  
  options = '<hr>'+
            '<p>'+
              '<b>Example</b><br>'+
              '<form class="form-inline">'+
                '<input type="checkbox" id="shellinaboxwarning"> Add addons option(s)'+
              '</form>'+
            '</p>'
  $(options).insertBefore("#configurationInsertionPoint")
});


