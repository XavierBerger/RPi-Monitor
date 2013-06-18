$(function () {
  setupqr();
  doqr(document.URL);
  $.getJSON('friends.json', function(data) {
    ShowFriends(data.friends);
  });
});
