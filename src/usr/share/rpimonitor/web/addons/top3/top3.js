var activePage = GetURLParameter('activePage');

$(function () {
  options = '<p>'+
              'No option available for this addon'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  UpdateAddon();
  
});
