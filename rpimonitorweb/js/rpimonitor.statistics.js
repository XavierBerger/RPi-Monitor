$(function () {

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
  function update_fname_handler1(bf) {
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
    $.getJSON('/rpimonitord.status', function(data) {
      var graphlist="<select id='selected_graph'>\n";
      for (var i=0;i<data.section.length;i++)
      { 
        graphlist+="<option value='/"+data.section[i]+".rrd'>"+data.section[i]+"</option>\n";
      }
      graphlist+="</select>\n";
      
      //graphlist+=$("#mygraph_res").parent().html();
      //$("#mygraph_res").parent().append().html(graphlist);

    });
  }

  // this function is invoked when the RRD file name changes
  function fname_update() {
    // invalidate them, so we know when they are both loaded
    rrd_data=undefined;

    fname="/cpuload.rrd";
    try {
      FetchBinaryURLAsync(fname,update_fname_handler1);
    } catch (err) {
       alert("Failed loading "+fname+"\n"+err);
    }
  }
});
