$(function () {
  var current_path = window.location.pathname.split('/').pop();

  topmenu=
'      <div class="navbar navbar-inverse navbar-fixed-top">'+
'        <div class="navbar-inner">'+
'          <div class="container">'+
'            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">'+
'              <span class="icon-bar"></span>'+
'              <span class="icon-bar"></span>'+
'              <span class="icon-bar"></span>'+
'            </button>'+
'            <a class="brand" href="index.html"><img src="img/logo.png"> RPi-Monitor</a>'+
'            <div class="nav-collapse collapse">'+
'              <ul class="nav">';

  if ( (current_path == 'status.html') || (current_path == 'statistics.html') ) {
    if (current_path == 'status.html'){
      status_active = 'class="active"';
      statistic_active = '';
    }
    else {
      status_active = '';
      statistic_active = 'class="active"';
    }
    topmenu+=
'                <li ' + status_active + '><a href="status.html">Status</a></li>'+
'                <li ' + statistic_active + '><a href="statistics.html">Statistics</a></li>'+
'                <li><a href="#Configuration" data-toggle="modal">Configuration</a></li>';

    configuration=
'      <div id="Configuration" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'        <div class="modal-header">'+
'          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
'          <h3 id="myModalLabel">Configuration</h3>'+
'        </div>'+
'        <div class="modal-body">'+
'          <p>New feature will be implemented in future releases.<br>'+
'          Configuration will be stored into the browser HTML5 storage.</p>'+
'        </div>'+
'        <div class="modal-footer">'+
'          <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
'          <button class="btn btn-primary">Save changes</button>'+
'        </div>'+
'      </div>';
    $('#configuration').html(configuration);

  }

    topmenu+=
'                <li class="dropdown">'+
'                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>'+
'                  <ul class="dropdown-menu">'+
'                    <li class="nav-header">RPI-Monitor</li>'+
'                    <li><a href="#License" data-toggle="modal">License</a></li>'+
'                    <li><a href="#About" data-toggle="modal">About</a></li>'+
'                    <li class="divider"></li>'+
'                    <li class="nav-header">Related links</li>'+
'                    <li><a href="http://rpi-experiences.blogspot.fr/">RPI-experiences</a></li>'+
'                    <li><a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a></li>'+
'                  </ul>'+
'                </li>'+
'              </ul>'+
'            </div><!--/.nav-collapse -->'+
'          </div>'+
'        </div>'+
'      </div>';

    license=
'      <div id="License" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'        <div class="modal-header">'+
'          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
'          <h3 id="myModalLabel">License</h3>'+
'        </div>'+
'        <div class="modal-body">'+
'          <p>'+
'This program is free software: you can redistribute it and/or modify<br>'+
'it under the terms of the GNU General Public License as published by<br>'+
'the Free Software Foundation, either version 3 of the License, or<br>'+
'(at your option) any later version.<br>'+
'<br>'+
'This program is distributed in the hope that it will be useful,<br>'+
'but WITHOUT ANY WARRANTY; without even the implied warranty of<br>'+
'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br>'+
'GNU General Public License for more details.<br>'+
'<br>'+
'You should have received a copy of the GNU General Public License<br>'+
'along with this program.  If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.'+
'</p>'+
'<hr>'+
'RPi-Monitor is using third party software hava there own license.<br>'+
'Ref. <a href="#About" data-dismiss="modal" data-toggle="modal">About</a> to have the list of software used by RPi-Monitor. '+
'        </div>'+
'        <div class="modal-footer">'+
'          <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
'        </div>'+
'      </div>';


    about=
'      <div id="About" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'        <div class="modal-header">'+
'          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
'          <h3 id="myModalLabel">About</h3>'+
'        </div>'+
'        <div class="modal-body">'+
'          <p><b>Version</b>: 1.0'+
'          <b>by</b> Xavier Berger <a href="http://rpi-experiences.blogspot.fr/">Blog</a> <a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a></p>'+
'          <hr>'+
'          <p><b>RPI-Monitor</b> is free software developped on top of other open source'+
'tools : <a href="http://twitter.github.io/bootstrap/">bootstrap</a>, <a href="http://jquery.com/">jquery</a>, <a href="https://code.google.com/p/jsqrencode/">jsqrencode</a> and <a href="http://javascriptrrd.sourceforge.net/">javascriptrrd</a>.<br>'+
'The look and feel of the status page is clearly inspired by <a href="https://github.com/Bioshox/Raspcontrol">Raspcontrol</a>.</p>'+
'          <p><b>Raspberry Pi</b> and Raspberry Pi logo are properties of <a href="http://www.raspberrypi.org/">Raspberry Pi Fundation</a>.</p>'+
'        </div>'+
'        <div class="modal-footer">'+
'          <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
'        </div>'+
'      </div>';

  $('#topmenu').html(topmenu);

  $('#footer').html(
    license + about +
'      <div class="container">'+
'        <p class="muted credit"><small>Follow RPi-Monitor news in <a href="http://rpi-experiences.blogspot.fr/">RPI-Experiences</a> blog'+
'        and <a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a>.'+
'        Raspberry Pi brand and Raspberry Pi logo are properties of <a href="http://www.raspberrypi.org/">Raspberry Pi Fundation</a></small></p>'+
'      </div>'
  );

});
