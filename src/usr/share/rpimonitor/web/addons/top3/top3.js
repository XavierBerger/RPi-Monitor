var activePage = GetURLParameter('activePage');
if (activePage == null){ activePage = 0; }

$(function () {
  options = '<p>'+
              'No option available for this addon'+
            '</p>'
  $(options).insertBefore("#optionsInsertionPoint")
  UpdateAddon();
  
});
