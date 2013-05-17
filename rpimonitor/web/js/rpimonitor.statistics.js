$(function () {

  //
  fname="stat/cpuload.rrd";

  // Remove the Javascript warning
  document.getElementById("infotable").deleteRow(0);

  // fname and rrd_data are the global variable used by all the functions below
  fname_update();

  // This function updates the Web Page with the data from the RRD
  // archive header  when a new file is selected
  function update_fname() {
    var graph_opts={legend: { noColumns:4}};
    var ds_graph_opts={'Oscilator':{ color: "#ff8000",
                                     lines: { show: true, fill: true, fillColor:"#ffff80"} },
                       'Idle':{ label: 'IdleJobs', color: "#00c0c0",
                                lines: { show: true, fill: true} },
                       'Running':{color: "#000000",yaxis:2}};

    // the rrdFlot object creates and handles the graph
    var f=new rrdFlot("mygraph",rrd_data,graph_opts,ds_graph_opts);
  }

  // This is the callback function that, given a binary file object,
  // verifies that it is a valid RRD archive and performs the update
  // of the Web page
  function update_fname_handler(bf) {
    delete rrd_data;
    delete i_rrd_data;
    var i_rrd_data=undefined;
    if (bf.getLength()<1) {
      alert("File "+fname+" is empty (possibly loading failed)!");
      return 1;
    }
    try {
      var i_rrd_data=new RRDFile(bf);
    } catch(err) {
      alert("File "+fname+" is not a valid RRD archive!\n"+err);
    }
    if (i_rrd_data!=undefined) {
      rrd_data=i_rrd_data;
      update_fname()
    }

    // Get json to extract the list of rrd availble
    $.ajaxSetup({ cache: false });
    $.getJSON('stat/rpimonitord.json', function(data) {
      var graphlist="Graph: <select id='selected_graph'>\n";
      for (var i=0;i<data.section.length;i++)
      {
        graphlist+="<option value='stat/"+data.section[i]+".rrd'";
        if ( fname=="stat/"+data.section[i]+".rrd") { graphlist+=" selected "; }
        graphlist+=">"+data.section[i]+"</option>\n";
      }
      graphlist+="</select>\n";

      $("#mygraph_res_title").html(graphlist);
      $('#selected_graph').on('change', function (e) {
        fname = this.value;
        fname_update();
      })
      
      if ( firstload == true ){
        firstload=false;
        ShowFriends(data.friends);
      }

    }).fail(function() {
        $('#message').html("<b>Can not get status information. Is rpimonitord.conf correctly configured on server?</b>") ;
        $('#message').removeClass('hide');
        $('#mygraph').addClass('hide');
      });
  }

  // this function is invoked when the RRD file name changes
  function fname_update() {
    // invalidate them, so we know when they are both loaded
    rrd_data=undefined;

    try {
      FetchBinaryURLAsync(fname,update_fname_handler);
    } catch (err) {
       alert("Failed loading "+fname+"\n"+err);
    }
  }

});
