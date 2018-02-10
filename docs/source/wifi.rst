Monitoring a WiFi network
=========================

The following configuration is showing how to configure the monitoring of e WiFi
interface visible in ``wlan0``

To extract metrics representing the trafic on the interface we need to create 
a ``dynamic`` configuration to collect data in pseudo file system 
``/sys/class/net/wlan0/statistics/``. 

Collect metrics
^^^^^^^^^^^^^^^

::

    dynamic.1.name=wifi_received
    dynamic.1.source=/sys/class/net/wlan0/statistics/rx_bytes
    dynamic.1.regexp=(.*)
    dynamic.1.postprocess=$1*-1
    dynamic.1.rrd=DERIVE

    dynamic.2.name=wifi_send
    dynamic.2.source=/sys/class/net/wlan0/statistics/tx_bytes
    dynamic.2.regexp=(.*)
    dynamic.2.postprocess=
    dynamic.2.rrd=DERIVE

.. note:: We dicided to represent downstream data with negative values. This is
        performed by the postprocess command: ``$1*-1``


Add status
^^^^^^^^^^

The collected metrics will be displayed in ``status`` page as define in the 
configuration bellow:

::

    web.status.1.content.9.name=WiFi
    web.status.1.content.9.icon=wifi.png
    web.status.1.content.9.line.1="WiFi Sent: <b>"+KMG(data.wifi_send)+"<i class='icon-arrow-up'></i></b> Received: <b>"+KMG(Math.abs(data.wifi_received)) + "<i class='icon-arrow-down'></i></b>"

Add statistics
^^^^^^^^^^^^^^

The following configuration add one graph to statistics page with the 2 curves 
representing upstream and downstream metrics:

::

    web.statistics.1.content.1.name=WiFi
    web.statistics.1.content.1.graph.1=wifi_send
    web.statistics.1.content.1.graph.2=wifi_received
    web.statistics.1.content.1.ds_graph_options.wifi_send.label=Upload bandwidth (bits)
    web.statistics.1.content.1.ds_graph_options.wifi_send.lines={ fill: true }
    web.statistics.1.content.1.ds_graph_options.wifi_send.color="#FF7777"
    web.statistics.1.content.1.ds_graph_options.wifi_received.label=Download bandwidth (bits)
    web.statistics.1.content.1.ds_graph_options.wifi_received.lines={ fill: true }
    web.statistics.1.content.1.ds_graph_options.wifi_received.color="#77FF77"

In this configuration, we set color to green for downstream and red for upstream. 
The curves are filled.

.. warning:: Be sure to use Linux filefeed format with line ending with LF (and not CR/LF like in Windows).
