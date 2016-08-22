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
var strips;
var postProcessInfo=[];
var justgageId=0;
var postProcessCommand=[];

function RowTemplate(id,image,title){
  return ""+
        "<div class='row row"+id+"'>"+
          "<div class='Title'><img src='"+image+"' alt='"+title+"'> &nbsp;"+title+"</div>"+
          "<div class='Text' id='Text"+id+"'><b></b></div>"+
        "</div>"+
        "<hr class='row"+id+"'>"
}

function ActivatePopover(){
  while((info=postProcessInfo.pop()) != null) {
    $(info[0]).popover({trigger:'hover',placement:'bottom',html:true, title: info[1], content: info[2] });
  }
  $("#packages").popover();
}

function UpdateStatus () {
  justgageId=0
  $("#packages").empty();

  $.getJSON('dynamic.json', function(data) {
    // Concatenate dynamic.json and static.json into data variable
    $.extend(true, data, getData('static'));

    $('#message').addClass('hide');

    for (var iloop=0; iloop < strips.length; iloop++){
      eval( 'visibility = '+strips[iloop].visibility )
      if ( visibility == 0) {
        $('.row'+iloop).addClass('hide')
      }
      else {
        $('.row'+iloop).removeClass('hide')
      }
      text = "";
      for (var jloop=0; jloop < strips[iloop].line.length; jloop++){
        var line = strips[iloop].line[jloop];
        text = text + "<p>";
        try {
            text = text + eval( line );
        }
        catch (e) {
          text = text + "ERROR: " + line + " -> " + e;
        }
        finally {
          text = text + "</p>";
        }
      }
      $("#Text"+iloop).html(text);
    }

    while((command=postProcessCommand.pop()) != null) {
      eval( command )
    }

    ActivatePopover();

  })
  .fail(function() {
      $('#message').html("<span class='glyphicon glyphicon-warning-sign'></span> &nbsp; Can not get information (dynamic.json) from <b>RPi-Monitor</b> server.");
      $('#message').removeClass('hide');
    });

}

function ConstructPage()
{
  var activePage = GetURLParameter('activePage');

  data = getData('status');
  if ( ( typeof activePage == 'undefined') ||
       ( activePage >= data.length ) ) {
    activePage=0;
  }
  if ( data.length > 1 ) {
    $('<h2><p class="text-info">'+data[activePage].name+'</p></h2><hr>').insertBefore("#insertionPoint");
  }
  for ( var iloop=0; iloop < data[activePage].content.length; iloop++) {
    $(RowTemplate(iloop,"img/"+data[activePage].content[iloop].icon,data[activePage].content[iloop].name)).insertBefore("#insertionPoint");
    strips=data[activePage].content;
  }
  UpdateStatus();
}

function AddOption()
{
  options =
        '<p>'+
          '<b>Status</b><br>'+
          '<form class="form-inline">'+
            '<input type="checkbox" id="statusautorefresh"> Auto refresh status page'+
          '</form>'+
        '</p>';
  $(options).insertBefore("#optionsInsertionPoint")
}

$(function () {
  /* Set no cache */
  $.ajaxSetup({ cache: false });

  // Load data from local storage
  animate=(localStorage.getItem('animate') === 'true');
  statusautorefresh=(localStorage.getItem('statusautorefresh') === 'true');

  /* Show friends */
  ShowFriends();

  /* Add qrcode shortcut*/
  setupqr();
  doqr(document.URL);

  /* Get static values once */
  ConstructPage();

  /* Populate option dialog*/
  AddOption();

  //Initialize dialog values
  $('#statusautorefresh').attr('checked', statusautorefresh );

  // Events management
  $('#animate').click(function(){
    animate = $('#animate').is(":checked");
    localStorage.setItem('animate', animate);
    SetProgressBarAnimate();
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

  if ( statusautorefresh ) {
    refreshTimerId = setInterval( UpdateStatus , 10000 )
    clockId=setInterval(Tick,1000);
  }

});


