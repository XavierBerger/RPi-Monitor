$(function () {
  $("#shellinaboxframe").attr('src', 'https://'+document.domain+':'+shellinaboxport);
  $.getJSON('/stat/rpimonitord.json', function(data) {
    ShowFriends(data.friends);
  });
});
