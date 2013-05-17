$(function () {
  $("#shellinaboxframe").attr('src', shellinaboxuri);
  $.getJSON('stat/rpimonitord.json', function(data) {
    ShowFriends(data.friends);
  });
});
