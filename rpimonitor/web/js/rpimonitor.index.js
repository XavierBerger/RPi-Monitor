$(function () {
  setupqr();
  doqr(document.URL);
  $.getJSON('/stat/rpimonitord.json', function(data) {
    ShowFriends(data.friends);
  });
});
