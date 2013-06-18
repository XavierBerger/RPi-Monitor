var animate;
var shellinabox;
var shellinaboxuri;
var shellinaboxwarning;
var statusautorefresh;
var refreshTimerId;
var clickId;
var firstload=true;

function SetProgressBarAnimate(){
  $('#animate').attr('checked', animate );
  if ( animate ) {
    $('.progress').addClass('active');
  }
  else{
    $('.progress').removeClass('active');
  }
}

function SetShellinaboxMenu(){
  $('#shellinabox').attr('checked', shellinabox );
  $('#shellinaboxwarning').attr('checked', shellinaboxwarning );
  if ( shellinabox ) {
    $('#shellinaboxmenu').removeClass('hide');
    $('#shellinaboxuri').val(shellinaboxuri);
    $('#shellinaboxuri').attr('disabled',false);
    $('#shellinaboxwarning').attr('disabled',false);
    $('#shellinaboxwarninglabel').removeClass('muted');
  }
  else{
    $('#shellinaboxmenu').addClass('hide');
    $('#shellinaboxuri').val('');
    $('#shellinaboxuri').attr('disabled',true);
    $('#shellinaboxwarning').attr('disabled',true);
    $('#shellinaboxwarninglabel').addClass('muted');
  }
}

function ShowFriends(friend){
  if ( friend ) { 
    $('#friends').empty();
    for (var i = 0; i < friend.length; i++) {
      details=friend[i].split('=');
      $('#friends').append('<li><a href="http://'+details[0]+'">'+details[1]+'</a></li>');
    }
    $('#divfriends').removeClass('hide');
  }
}

$(function () {

  var dialogs="";

  function AddConfigurationDialog(){
      dialogs+=
        '<div id="Configuration" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 id="myModalLabel">Configuration</h3>'+
          '</div>'+
          '<div class="modal-body">'+
            '<p><label class="checkbox"><input type="checkbox" id="animate"> Animate progress bar</label></p>'+
            '<p><form class="form-inline">'+
              '<label class="checkbox"><input type="checkbox" id="shellinabox"> Show shellinabox menu</label> <br>'+
              '&nbsp;&nbsp;&nbsp;&nbsp;'+
              '<label class="checkbox"><input type="text" placeholder="Address" id="shellinaboxuri" class="input-medium"></label><br>'+
              '&nbsp;&nbsp;&nbsp;&nbsp;'+
              '<label class="checkbox" id="shellinaboxwarninglabel"><input type="checkbox" id="shellinaboxwarning"> Do not show warning on page close or refresh</label>'+
            '</form></p>'+
            '<p><label class="checkbox"><input type="checkbox" id="statusautorefresh"> Auto refresh status page</label></p>'+
          '</div>'+
          '<div class="modal-footer">'+
            '<button class="btn" data-dismiss="modal" aria-hidden="true" id="closeconfiguration">Close</button>'+
          '</div>'+
        '</div>';
  }

  function AddLicenseDialog(){
    dialogs+=
      '<div id="License" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h3 id="myModalLabel">License</h3>'+
        '</div>'+
        '<div class="modal-body">'+
          'This program is free software: you can redistribute it and/or modify<br>'+
          'it under the terms of the GNU General Public License as published<br>'+ 
          'by the Free Software Foundation, either version 3 of the License, or<br>'+
          '(at your option) any later version.<br>'+
          '<br>'+
          'This program is distributed in the hope that it will be useful,i but<br>'+
          'WITHOUT ANY WARRANTY; without even the implied warranty of<br>'+
          'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.<br>'+
          'See the GNU General Public License for more details.<br>'+
          '<br>'+
          'You should have received a copy of the GNU General Public License<br>'+
          'along with this program.  If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.'+
          '</p>'+
          '<hr>'+
          '<b>RPi-Monitor</b> is using third party software hava there own license.<br>'+
          'Ref. <a href="#About" data-dismiss="modal" data-toggle="modal">About</a> to have the list of software used by <b>RPi-Monitor</b>. '+
        '</div>'+
        '<div class="modal-footer">'+
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
        '</div>'+
      '</div>';
  }

  function AddAboutDialog(){
    dialogs+=
      '<div id="About" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h3 id="myModalLabel">About</h3>'+
        '</div>'+
        '<div class="modal-body">'+
          '<p><b>Version</b>: {DEVELOPMENT} '+
          '<b>by</b> Xavier Berger <a href="http://rpi-experiences.blogspot.fr/">Blog</a> <a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a></p>'+
          '<hr>'+
          '<p><b>RPi-Monitor</b> is free software developped on top of other open source '+
            'tools : <a href="http://twitter.github.io/bootstrap/">bootstrap</a>, <a href="http://jquery.com/">jquery</a>, <a href="https://code.google.com/p/jsqrencode/">jsqrencode</a>, <a href="http://javascriptrrd.sourceforge.net/">javascriptrrd</a> and <a href="http://www.flotcharts.org/">Flot</a>.<br>'+
          '<p><b>Raspberry Pi</b> and Raspberry Pi logo are properties of <a href="http://www.raspberrypi.org/">Raspberry Pi Fundation</a>.</p>'+
        '</div>'+
        '<div class="modal-footer">'+
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
        '</div>'+
      '</div>';
  }

  function AddDialogs(){
     $('#dialogs').html(dialogs);
  }

  function AddTopmenu(){
    var current_path = window.location.pathname.split('/').pop();
    topmenu=
        '<div class="navbar navbar-inverse navbar-fixed-top">'+
          '<div class="navbar-inner">'+
            '<div class="container">'+
              '<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">'+
                '<span class="icon-bar"></span>'+
                '<span class="icon-bar"></span>'+
                '<span class="icon-bar"></span>'+
              '</button>'+
              '<a class="brand" href="index.html"><img src="img/logo.png"> RPi-Monitor</a>'+
              '<div class="nav-collapse collapse">'+
                '<ul class="nav">';

    status_active = '';
    statistics_active = '';
    shellinabox_active = '';
    var index=true;
    if (current_path == 'status.html'){
      status_active = 'class="active"';
      index=false;
    }
    if(current_path == 'statistics.html') {
      statistics_active = 'class="active"';
      index=false;
    }
    if(current_path == 'shellinabox.html') {
      shellinabox_active = 'class="active"';
      index=false;
    }

    if ( index==false ) {
      topmenu+=
                  '<li ' + status_active + '><a href="status.html">Status</a></li>'+
                  '<li ' + statistics_active + '><a href="statistics.html">Statistics</a></li>'+
                  '<li ' + shellinabox_active + ' id="shellinaboxmenu" class="hide"><a href="shellinabox.html">Shellinabox</a></li>'+
                  '<li><a href="#Configuration" data-toggle="modal">Configuration</a></li>';
      AddConfigurationDialog();
    }

    topmenu+=
                  '<li class="dropdown">'+
                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>'+
                    '<ul class="dropdown-menu">'+
                      '<li class="nav-header">RPi-Monitor</li>'+
                      '<li><a href="http://rpi-experiences.blogspot.fr/p/rpi-monitor.html" data-toggle="modal">Help</a></li>'+
                      '<li><a href="#License" data-toggle="modal">License</a></li>'+
                      '<li><a href="#About" data-toggle="modal">About</a></li>'+
                      '<li class="divider"></li>'+
                      '<li class="nav-header">Related links</li>'+
                      '<li><a href="http://rpi-experiences.blogspot.fr/">RPi-Experiences</a></li>'+
                      '<li><a href="https://github.com/XavierBerger/RPi-Monitor">RPi-Monitor</a></li>'+
                    '</ul>'+
                  '</li>'+
                '</ul>'+
              '</div><!--/.nav-collapse -->'+
              '<div class="navbar-inner pull-right hide" id="divfriends">'+
                '<ul class="nav">'+
                  '<li class="dropdown">'+
                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Friends <b class="caret"></b></a>'+
                    '<ul class="dropdown-menu" id="friends">'+
                    '</ul>'+
                  '</li>'+
                '</ul>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';

    AddLicenseDialog();
    AddAboutDialog();

    $('#topmenu').html(topmenu);

  }

  function AddFooter(){
    $('#footer').html(
        '<div class="container">'+
          '<p class="muted credit"><small>Follow RPi-Monitor news in <a href="http://rpi-experiences.blogspot.fr/">RPi-Experiences</a> blog '+
          'and <a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a>. '+
          'Raspberry Pi brand and Raspberry Pi logo are properties of <a href="http://www.raspberrypi.org/">Raspberry Pi Fundation</a></small></p>'+
        '</div>'
    );
  }


  animate=(localStorage.getItem('animate') === 'true');
  shellinabox=(localStorage.getItem('shellinabox') === 'true');
  shellinaboxuri=(localStorage.getItem('shellinaboxuri') || '/shellinabox');
  shellinaboxwarning=(localStorage.getItem('shellinaboxwarning') === 'true' );
  statusautorefresh=(localStorage.getItem('statusautorefresh') === 'true');

  AddTopmenu();
  AddDialogs();
  AddFooter();
  SetShellinaboxMenu();
  $('#statusautorefresh').attr('checked', statusautorefresh );

  $('#animate').click(function(){
    animate = $('#animate').is(":checked");
    localStorage.setItem('animate', animate);
    SetProgressBarAnimate();
  });


  $('#shellinabox').click(function(){
    shellinabox = $('#shellinabox').is(":checked");
    localStorage.setItem('shellinabox', shellinabox);
    SetShellinaboxMenu();
  });

  $('#shellinaboxuri').keyup(function(){
    shellinaboxuri = $('#shellinaboxuri').val();
    localStorage.setItem('shellinaboxuri', shellinaboxuri);
  });

  $('#shellinaboxwarning').click(function(){
    shellinaboxwarning = $('#shellinaboxwarning').is(":checked");
    localStorage.setItem('shellinaboxwarning', shellinaboxwarning);
  });
  
  
  $('#statusautorefresh').click(function(){
    statusautorefresh = $('#statusautorefresh').is(":checked");
    localStorage.setItem('statusautorefresh', statusautorefresh);
    if ( statusautorefresh ) {
      UpdateStatus(); 
      refreshTimerId = setInterval( UpdateStatus , 10000 ) 
      clockId=setInterval(Tick,1000);
    }
    else {
      clearInterval(refreshTimerId);
      clearInterval(clockId);
    };
  });

});
