$(function () {
  $("#shellinaboxframe").attr('src', shellinaboxuri);
  $.getJSON('friends.json', function(data) {
    ShowFriends(data.friends);
  });
});

window.onbeforeunload = function (e) {
  if ( shellinaboxwarning ) return;
  e = e || window.event;
  message="Closing or refreshing this page will also close your connection.";
  if (e) {
    e.returnValue = message;
  }
  return message;
};
