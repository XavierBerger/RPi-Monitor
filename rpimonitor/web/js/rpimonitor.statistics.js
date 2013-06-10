$(function () {
	// Remove the Javascript warning
	document.getElementById("infotable").deleteRow(0);

	rrd_data = [];

	$.ajaxSetup({
		cache : false
	});

	//Load data from localStorage
	var activestat = localStorage.getItem('activestat') || 0;
	var graphconf;

	function load_conf() {
		$.getJSON('stat/statistic.json', function (data) {
			localStorage.setItem('graphconf', JSON.stringify(data));
			graphconf = localStorage.getItem('graphconf');
		})
		.fail(function () {
			$('#message').html("<b>Can not get information (/stat/statistics.json) from RPi-Monitor server.</b>");
			$('#message').removeClass('hide');
			$('#mygraph').addClass('hide');
		})
		.always(function () {
			$('#preloader').addClass('hide');
		});
	}

	function set_graphlist() {
		var graphlist = "Graph: <select id='selected_graph'>\n";
		graphconf = localStorage.getItem('graphconf');
		conf = eval('(' + graphconf + ')');
		pageid = 0;
		for (var iloop = 0; iloop < conf[pageid].content.length; iloop++) {
			graphlist += "<option value='" + iloop + "'";
			if (activestat == iloop) {
				graphlist += " selected ";
			}
			graphlist += ">" + conf[pageid].content[iloop].name + "</option>\n";
		}
		graphlist += "</select>\n";

		$("#mygraph_res_title").html(graphlist);
		$('#selected_graph').on('change', function (e) {
			localStorage.setItem('activestat', this.value);
			update_graph();
		});
	}

	function fetch_graph() {
		pageid = 0;
		graphconf = localStorage.getItem('graphconf');
		conf = eval('(' + graphconf + ')');
		graph = conf[pageid].content[activestat].graph;
		try {
			for (var iloop = 0; iloop < graph.length; iloop++) {
				FetchBinaryURLAsync('stat/' + graph[iloop] + '.rrd', update_handler, iloop, graph.length);
			}
		} catch (err) {
			alert("Failed loading stat/" + graph[iloop] + ".rrd\n" + err);
		}
	}

	function update_handler(bf, idx) {
		var i_rrd_data = undefined;
		pageid = 0;
		graphconf = localStorage.getItem('graphconf');
		conf = eval('(' + graphconf + ')');
		graph = conf[pageid].content[activestat].graph;
		try {
			var i_rrd_data = new RRDFile(bf);
		} catch (err) {
			alert("File at idx " + idx + " is not a valid RRD archive!");
		}
		if (i_rrd_data != undefined) {
			rrd_data[idx]= i_rrd_data;
			prepare_graph(idx);
		}
		ready = 0;
		for (var iloop = 0; iloop < graph.length; iloop++) {
			if (rrd_data[iloop] != undefined) {
				ready++
			}
		}
		if (ready == graph.length) {
			update_graph()
		}
	}

	function DoNothing(ds) {
		this.getName = function () {
			return ds;
		}
		this.getDSNames = function () {
			return [ds];
		}
		this.computeResult = function (val_list) {
			return val_list[0];
		}
	}

	function Zero(ds_name) { //create a fake DS.
		this.getName = function () {
			return ds_name;
		}
		this.getDSNames = function () {
			return [];
		}
		this.computeResult = function (val_list) {
			return 0;
		}
	}

	function prepare_graph(idx) {
		var op_list = [];

		//http://javascriptrrd.sourceforge.net/docs/javascriptrrd_v0.6.0/src/examples/rrdJFlotFilter.html
		//http://sourceforge.net/p/javascriptrrd/discussion/914914/thread/935d8541/#17d3
		// Create a RRDFilterOp object that has the all DS's, with the one
		// existing in the original RRD populated with real values, and the other set to 0.
		pageid = 0;
		graphconf = localStorage.getItem('graphconf');
		conf = eval('(' + graphconf + ')');
		graph = conf[pageid].content[activestat].graph;
		var op_list = []; //list of operations
		//create a new rrdlist, which contains all original elements
		//    (kept the same by DoNothing())
		op_list.push(new DoNothing(rrd_data[idx].getDS(0).getName()));
		for (var iloop = 0; iloop < graph.length; iloop++) {
			if (iloop != idx) {
				op_list.push(new Zero(graph[iloop]));
			}
		}
		rrd_data[idx] = new RRDFilterOp(rrd_data[idx], op_list);
	}

	function update_graph() {
		rrd_data_sum = new RRDFileSum([rrd_data[0],rrd_data[2]]);
		var f = new rrdFlot("mygraph", rrd_data_sum);
	}

	load_conf();
	set_graphlist();
	fetch_graph();
});
