// This file is part of RPi-Monitor project
//
// Copyright 2014 - Xavier Berger - http://rpi-experiences.blogspot.fr/
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
function ConstructPage()
{
  var activePage = GetURLParameter('activePage');

  if ( typeof activePage == 'undefined') {
    activePage=localStorage.getItem('activePage', activePage);
    if ( activePage == null ) { activePage = 0 }
  }
  data = getData('addons');
  if ( activePage >= data.length ){
    activePage=0;
  }
  localStorage.setItem('activePage', activePage);
  if ( data.length > 1 ) {
    $('<h2 id="pagetitle"><p class="text-info">'+data[activePage].name+'</p><hr></h2>').insertBefore("#insertionPoint");
  }
  
  $("#insertionPoint").load("addons/"+data[activePage].addons+"/"+data[activePage].addons+".html")
  
  $("head").append("<link rel='stylesheet' type='text/css' href='addons/"+data[activePage].addons+"/"+data[activePage].addons+".css' />");
  
  jQuery.ajax({
      url: "addons/"+data[activePage].addons+"/"+data[activePage].addons+".js",
      dataType: "script",
    }).done(function() {
  });

}

$(function () {
  /* Set no cache */
  $.ajaxSetup({ cache: false });

  /* Show friends */
  ShowFriends();

  /* Add qrcode shortcut*/
  setupqr();
  doqr(document.URL);

  /* Get static values once */
  ConstructPage();
});


