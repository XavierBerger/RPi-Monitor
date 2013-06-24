$(function () {
  $("#shellinaboxframe").attr('src', shellinaboxuri);
  ShowFriends();
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
