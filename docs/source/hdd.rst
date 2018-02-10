hdd
===

Add other graphs from additional sources: other mount point


For this section we will take the example of an additional disk on sda as described previous article  RPi-Monitor: Advance usage and customization.


The disk have a disk with two partition /dev/sda1 and /dev/sda3.

The command and regular expression will be the following:

    sda1 disk size command : df -t ext2,  regular expression: sda1\s+(\d+)
    sda1 used space command : df -t ext2,  regular expression: sda1\s+\d+\s+(\d+)
    sda3 disk size command : df -t ext4,  regular expression: sda3\s+(\d+)
    sda3 used space command : df -t ext4,  regular expression: sda3\s+\d+\s+(\d+)

First we need to configure the extraction of partitions sizes which are extracted once at RPi-Monitor startup. We will create a file /etc/rpimonitord.conf.d/custo.conf with the data configured as static data like this:


static.10.name=storage1_total static.10.source=df -t ext2 static.10.regexp=sda1\s+(\d+) static.10.postprocess=$1/1024 static.11.name=storage2_total static.11.source=df -t ext4 static.11.regexp=sda3\s+(\d+) static.11.postprocess=$1/1024

The id of the KPIs start at 10 since in my configuration files the previous KPI was 9. This comment is the same for next ids.

The post processing is configured to transform kB into MB by dividing the extracted result by 1024.


For dynamic values extracted every 10 seconds, the configuration will be:

dynamic.14.name=storage1_used dynamic.14.source=df -t ext2 dynamic.14.regexp=sda1\s+\d+\s+(\d+) dynamic.14.postprocess=$1/1024 dynamic.14.rrd=GAUGE dynamic.15.name=storage2_used dynamic.15.source=df -t ext4 dynamic.15.regexp=sda3\s+\d+\s+(\d+) dynamic.15.postprocess=$1/1024 dynamic.15.rrd=GAUGE


Dynamic stat will be stored into a RRD File as GAUGE. Ref to RRDTool help for detail about Data Source Types.

Now we will add a status line for this disk whit the following icon:


Disk icon has been found here

This icons has to be installed into the img directory of RPi-Monitor which is by default /usr/share/rpimonitor/web/img/.


The configuration to add a new status strip will then be the following:

    

web.status.1.content.9.name=Storage web.status.1.content.9.icon=usb_hdd.png web.status.1.content.9.line.1="<b>/storage1</b> Used: <b>"+KMG(data.storage1_used,'M')+"</b> (<b>"+Percent(data.storage1_used,data.storage1_total,'M')+"</b>) Free: <b>"+KMG(data.storage1_total-data.storage1_used,'M')+ "</b> Total: <b>"+ KMG(data.storage1_total,'M') +"</b>" web.status.1.content.9.line.2=ProgressBar(data.storage1_used,data.storage1_total) web.status.1.content.9.line.3="<b>/storage2</b> Used: <b>"+KMG(data.storage2_used,'M')+"</b> (<b>"+Percent(data.storage2_used,data.storage2_total,'M')+"</b>) Free: <b>"+KMG(data.storage2_total-data.storage2_used,'M')+ "</b> Total: <b>"+ KMG(data.storage2_total,'M') +"</b>"


The configuration may need some explanation:

We do configure 4 lines. Each line is describing a javascript line using some predefined functions: KMG, Precent and ProgressBar. This function are called by the browser while rendering the page. Some variable coming from the extracted data are also used. These variables are starting by the keyword 'data.'. For deeper detail about this configuration execute the command man rpimonitord.conf


To see our modification we need to restart RPi-Monitor and refresh the statistics page into our browser.

    sudo  service rpimonitor restart


The result of the configuration is at the bottom of the following screenshot:




The status page is working, let's now add a graphic of the disk usage. This is done with the following configuration:


web.statistics.1.content.9.name=Storage1 web.statistics.1.content.9.graph.1=storage1_total web.statistics.1.content.9.graph.2=storage1_used web.statistics.1.content.9.ds_graph_options.storage1_total.label=Storage1 total space (MB) web.statistics.1.content.9.ds_graph_options.storage1_total.color="#FF7777" web.statistics.1.content.9.ds_graph_options.storage1_used.label=Storage1 used space (MB) web.statistics.1.content.9.ds_graph_options.storage1_used.lines={ fill: true } web.statistics.1.content.9.ds_graph_options.storage1_used.color="#7777FF" web.statistics.1.content.10.name=Storage2 web.statistics.1.content.10.graph.1=storage2_total web.statistics.1.content.10.graph.2=storage2_used web.statistics.1.content.10.ds_graph_options.storage2_total.label=Storage2 total space (MB) web.statistics.1.content.10.ds_graph_options.storage2_total.color="#FF7777" web.statistics.1.content.10.ds_graph_options.storage2_used.label=Storage2 used space (MB) web.statistics.1.content.10.ds_graph_options.storage2_used.lines={ fill: true } web.statistics.1.content.10.ds_graph_options.storage2_used.color="#7777FF"

The configuration may also need some explanation

We do configure 2 graphs each having 2 curves. The first curve represent the total and is using static data extracted previously. This curve will be represented as a light red line.

The second curve is representing the usage of disk and is represented as a light blue line filled. The parameters defining the curve are define by the keyword ds_graph_options. Details of this parameter can be found in javascriptrrd help page. Restart rpimonitor to activate the new graph.


After waiting a little time to let the system extract data you will see this kind of graph.





