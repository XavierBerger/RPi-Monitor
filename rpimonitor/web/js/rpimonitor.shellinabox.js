// This file is part of RPi-Monitor project
//
// Copyright 2013 - Xavier Berger - http://rpi-experiences.blogspot.fr/
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

$(function () {
  $("#shellinaboxframe").attr('src', shellinaboxuri);
  ShowFriends();
  /* Add qrcode shortcut*/
  setupqr();
  doqr(document.URL);
  resize_frame();
});

function resize_frame(){
  var window_height = $(window).height() - 30 - 40;
  $('#shellinaboxdiv').css('height',window_height+'px');
}


$(window).resize(function() {
  resize_frame();
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
