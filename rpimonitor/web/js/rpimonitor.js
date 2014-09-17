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
var animate;
var shellinabox;
var shellinaboxuri;
var shellinaboxwarning;
var statusautorefresh;
var refreshTimerId;
var clickId;
var active_rra;

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

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

function getData( name ){
  if ( localStorage.getItem(name+'Version') == localStorage.getItem('version') ) {
    return eval("(" + localStorage.getItem(name) + ')');
  }
  else
  {
    return $.ajax({
      url: name + '.json',
      dataType: 'json',
      async: false,
      success: function(data) {
        localStorage.setItem(name, JSON.stringify(data))
        localStorage.setItem(name+'Version', localStorage.getItem('version'))
        return data
      },
      fail: function () {
        $('#message').html("<b>Can not get information (<a href='"+name.json+"'>"+name+".json</a>) from RPi-Monitor server.</b>");
        $('#message').removeClass('hide');
        return null
      }
    }).responseJSON
  }
}

function ShowFriends(){
  var data = getData('friends')
  if ( data.length > 0 ) {
    $('#friends').empty();
    for (var i = 0; i < data.length; i++) {
      $('#friends').append('<li><a href="'+data[i].link+'">'+data[i].name+'</a></li>');
    }
    $('#divfriends').removeClass('hide');
  } 
}

function AddFooter(){
$('#footer').html(
  '<div class="container text-center">'+
    '<p class="muted credit"><small><a href="http://rpi-experiences.blogspot.fr/">RPi-Experiences</a> | '+
    '<a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a> | '+
    '<a href="http://www.raspberrypi.org/">Raspberry Pi Foundation</a></small></p>'+
  '</div>'
);
}

function AddDialogs(){
  var dialogs="";

  // Add Configuration Dialog
  dialogs+=
    '<div id="Configuration" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 id="myModalLabel">Configuration</h3>'+
      '</div>'+
      '<div class="modal-body">'+
        '<p><label class="checkbox"><input type="checkbox" id="animate"> Animate progress bar</label></p>'+
        '<hr>'+
        '<p><form class="form-inline">'+
          '<label class="checkbox"><input type="checkbox" id="shellinabox"> Show shellinabox menu</label> <br>'+
          '&nbsp;&nbsp;&nbsp;&nbsp;'+
          '<label class="checkbox"><input type="text" placeholder="Address" id="shellinaboxuri" class="input-medium"></label><br>'+
          '&nbsp;&nbsp;&nbsp;&nbsp;'+
          '<label class="checkbox" id="shellinaboxwarninglabel"><input type="checkbox" id="shellinaboxwarning"> Do not show warning on page close or refresh</label>'+
        '</form></p>'+
        '<hr>'+
        '<p><label class="checkbox"><input type="checkbox" id="statusautorefresh"> Auto refresh status page</label></p>'+
        '<hr>'+
        '<p><label class="checkbox">Default graph timeline <select class="span3" id="active_rra">'+
          '<option value="0" '+ ( active_rra == 0 ? 'selected' : '' ) +'>10s (24h total)</option>'+
          '<option value="1" '+ ( active_rra == 1 ? 'selected' : '' ) +'>60s (2 days total)</option>'+
          '<option value="2" '+ ( active_rra == 2 ? 'selected' : '' ) +'>10min (14 days total)</option>'+
          '<option value="3" '+ ( active_rra == 3 ? 'selected' : '' ) +'>30min (31 days total)</option>'+
          '<option value="4" '+ ( active_rra == 4 ? 'selected' : '' ) +'>60min (12 months total)</option>'+
          '</select></label></p>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button class="btn" data-dismiss="modal" aria-hidden="true" id="closeconfiguration">Close</button>'+
      '</div>'+
    '</div>';

  // Add License Dialog 
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

  // Add About Dialog
  dialogs+=
    '<div id="About" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 id="myModalLabel">About</h3>'+
      '</div>'+
      '<div class="modal-body">'+
        '<p><b>Version</b>: 2.9 '+
        '<b>by</b> Xavier Berger <a href="http://rpi-experiences.blogspot.fr/">Blog</a> <a href="https://github.com/XavierBerger/RPi-Monitor">GitHub</a></p>'+
        'With the contribution of users sharing ideas and competences on Github.'+
        '<hr>'+
        '<p><b>RPi-Monitor</b> is free software developped on top of other open source '+
          'tools : <a href="http://twitter.github.io/bootstrap/">bootstrap</a>, <a href="http://jquery.com/">jquery</a>, <a href="https://code.google.com/p/jsqrencode/">jsqrencode</a>, <a href="http://javascriptrrd.sourceforge.net/">javascriptrrd</a> and <a href="http://www.flotcharts.org/">Flot</a>.<br>'+
        '<p><b>Raspberry Pi</b> and Raspberry Pi logo are properties of <a href="http://www.raspberrypi.org/">Raspberry Pi Fundation</a>.</p>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>'+
      '</div>'+
    '</div>';

  $('#dialogs').html(dialogs);
}

function AddTopmenu(){
  page = getData('page')
  data = getData('static')
  try {
    document.title = eval(page.pagetitle);
  }
  catch (err) {
    document.title=page.pagetitle;
  }
  try {
    icon = eval(page.icon);
  }
  catch (err) {
    icon=page.icon;
  }
  try {
    menutitle = eval(page.menutitle);
  }
  catch (err) {
    menutitle=page.menutitle;
  }
  topmenu=
	  '<nav class="navbar navbar-inverse" role="navigation">' +
	  '<div class="container-fluid">' +
		'<div class="navbar-header">' +
		  '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
			'<span class="sr-only">Toggle navigation</span>' +
			'<span class="icon-bar"></span>' +
			'<span class="icon-bar"></span>' +
			'<span class="icon-bar"></span>' +
		  '</button>' +
		  '<a class="navbar-brand" href="#"><img src="'+icon+'"> &nbsp;'+menutitle+'</a>' +
		'</div>' +
		'<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
		  '<ul class="nav navbar-nav">' +
		    '<li id="statusmenu"><a id="statuslink" href="status.html">Status</a></li>'+
            '<li id="statisticsmenu"><a id="statisticslink" href="statistics.html">Statistics</a></li>'+
            '<li id="shellinaboxmenu" class="hide"><a href="shellinabox.html">Shellinabox</a></li>'+
            '<li id="configurationmenu"><a href="#Configuration" data-toggle="modal">Configuration</a></li>'+
            '<li class="dropdown">' +
			  '<a href="#" class="dropdown-toggle" data-toggle="dropdown">About <span class="caret"></span></a>' +
			  '<ul class="dropdown-menu" role="menu">' +
				'<li class="dropdown-header"> <b>RPi-Monitor</b></li>'+
				'<li><a href="http://rpi-experiences.blogspot.fr/p/rpi-monitor.html" data-toggle="modal">Help</a></li>'+
				'<li><a href="#License" data-toggle="modal">License</a></li>'+
				'<li><a href="#About" data-toggle="modal">About</a></li>'+
				'<li class="divider"></li>'+
				'<li class="dropdown-header"> <b>Related links</b></li>'+
				'<li><a href="http://rpi-experiences.blogspot.fr/">RPi-Experiences</a></li>'+
				'<li><a href="https://github.com/XavierBerger/RPi-Monitor">RPi-Monitor</a></li>'+
			  '</ul>' +
			'</li>' +
		  '</ul>' +
			'<div class="pull-right hide" id="divfriends">'+
			  '<ul class="nav navbar-nav">'+
				'<li class="dropdown">'+
				  '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Friends <b class="caret"></b></a>'+
				  '<ul class="dropdown-menu" id="friends">'+
				  '</ul>'+
				'</li>'+
			  '</ul>'+
			'</div>'+
		'</div><!-- /.navbar-collapse -->' +
	  '</div><!-- /.container-fluid -->' +
	'</nav>'
  $('#topmenu').html(topmenu);
}

function UpdateMenu(){

  var index=true;
  var current_path = window.location.pathname.split('/').pop();
  
  // Manage shellinabox menu
  SetShellinaboxMenu();
  
  // Manage active link
  if (current_path == 'status.html'){
    $('#statusmenu').addClass('active');
    index=false;
  }
  if (current_path == 'statistics.html'){
    $('#statisticsmenu').addClass('active');
    index=false;
  }
  if (current_path == 'shellinabox.html'){
    $('#shellinaboxmenu').addClass('active');
    index=false;
  }
  
  // On home page, the menu is not shown
  if ( index==true ) {
    $('#statusmenu').addClass('hide');
    $('#statisticsmenu').addClass('hide');
    $('#shellinaboxmenu').addClass('hide');
    $('#configurationmenu').addClass('hide');
    return;
  }
  
  var data = getData('menu');
  if ( data.status.length > 1 ){
    $('#statusmenu').addClass('dropdown');
    var dropDownMenu='<ul class="dropdown-menu">';
    dropDownMenu+='<li class="nav-header">Status</li>'
    for ( var iloop=0; iloop < data.status.length; iloop++){
      dropDownMenu+='<li><a href="status.html?activePage='+iloop+'">'+data.status[iloop]+'</a></li>';
    }
    dropDownMenu+='</ul>';
    $('#statuslink').html( 'Status <b class="caret"></b>')
    $(dropDownMenu).insertAfter('#statuslink');
    $('#statuslink').addClass('dropdown-toggle');
    $('#statuslink').attr('data-toggle','dropdown');
    $('#statuslink').attr('href','#');
  }
  if ( data.statistics.length > 1 ){
    $('#statisticsmenu').addClass('dropdown');
    var dropDownMenu='<ul class="dropdown-menu">';
    dropDownMenu+='<li class="nav-header">Statistics</li>'
    for ( var iloop=0; iloop < data.statistics.length; iloop++){
      dropDownMenu+='<li><a href="statistics.html?activePage='+iloop+'">'+data.statistics[iloop]+'</a></li>';
    }
    dropDownMenu+='</ul>';
    $('#statisticslink').html( 'Statistics <b class="caret"></b>')
    $(dropDownMenu).insertAfter('#statisticslink');
    $('#statisticslink').addClass('dropdown-toggle');
    $('#statisticslink').attr('data-toggle','dropdown');
    $('#statisticslink').attr('href','#');
  }
  
}

function getVersion(){
  $.ajax({
    url: 'version.json',
    dataType: 'json',
    async: false,
    success: function(data) {
        localStorage.setItem('version', data.version);
      }
    })
}

$(function () {

  if ( localStorage == null ) {
    alert ("TypeError: localStorage is null\n\n" +
           "Activate HTML5 localStorage before continuing."
          );
  }
  // Load data from local storage
  animate=(localStorage.getItem('animate') === 'true');
  shellinabox=(localStorage.getItem('shellinabox') === 'true');
  shellinaboxuri=(localStorage.getItem('shellinaboxuri') || '/shellinabox');
  shellinaboxwarning=(localStorage.getItem('shellinaboxwarning') === 'true' );
  statusautorefresh=(localStorage.getItem('statusautorefresh') === 'true');
  active_rra=(localStorage.getItem('active_rra') || 0);

  // Construct the page template
  getVersion();
  AddTopmenu();
  AddDialogs();
  AddFooter();
  UpdateMenu();

  SetProgressBarAnimate();
 
  //Initialize dialog values
  $('#statusautorefresh').attr('checked', statusautorefresh );
 
  // Events management
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

  $('#active_rra').change(function(){
    localStorage.setItem('active_rra',$('#active_rra').val())
  });

});
