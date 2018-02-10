Temperature and humidity sensor
===============================

Overview
--------
In this chapter we will see how to connect a DHT11 or DHT22 Temperature and
Humidity sensor and configure **RPi-Monitor** to present and draw the outputs.

This article will also explain another capability of **RPi-Monitor** 2.x: the dual-axis.

Adafruit created a very good tutorial explaining how to use DHT11 or DHT22 . 
This tutorial is available at this `here <http://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging/wiring>`_.

Electronic assembly
-------------------

This electronic assembly is quite simple and will need:

* 1 x DHT11 or 1 x DHT22
* 1 x 4.7k resistor

Plug them as described in the following schema:

.. figure:: _static/dht11wiring.png
  :width: 400px 
  :align: center
  
  Schema extracted from Adafruit but using GPIO #27 instead of GPIO #4

Software installation
---------------------

Thanks to Adafruit ( again ;-) ) the installation is quite simple and can be 
done with two command lines.

Download Adafruit_DHT form Adafruit's github repository and copy is in ``/usr/bin`` as follow:

::

    wget http://goo.gl/oadpl -O Adafruit_DHT
    sudo cp Adafruit_DHT /usr/bin/

To test the electronic assembly and the software installation execute the 
following command (for DHT11):

:: 

    pi@raspberrypi ~ $ sudo Adafruit_DHT 11 27
    Using pin #17Data (40): 0x28 0x0 0x18 0x0 0x40
    Temp = 24 *C, Hum = 40 %

You should see the information about temperature and humidity displayed as shown upper.

.. note:: The DHT11 and DHT22 sensors will only respond every second so if you 
          are not getting data, be sure to wait few seconds before trying again.

RPi-Monitor configuration
-------------------------

.. warning:: Be sure to use Linux linefeed format with line ending with LF 
             (and not CR/LF like in Windows).

Let's now use this information and add humidity graphs on existing temperature graph.

We first have to extract the data. This is done like this:

::

    dynamic.17.name=humidity 
    dynamic.17.source=Adafruit_DHT 11 27 
    dynamic.17.regexp=Hum = (\S+) 
    dynamic.17.postprocess= 
    dynamic.17.rrd=GAUGE

We will now add the humidity curve into the graph of temperature. 
This can be done with the configuration bellow:

::

    web.statistics.1.content.8.name=humidity 
    web.statistics.1.content.8.ds_graph_options.humidity.label=Humidity (%) 
    web.statistics.1.content.8.ds_graph_options.humidity.yaxis=2 
    web.statistics.1.content.8.graph_options.y2axis={ position: "right", min: 0, max: 100 }

As the unit are different than the one existing on the initial axis, 
we will add a second axis for the percentage of humidity. This is the purpose 
of the two last lines of the configuration bellow.

The first line is defining the usage of axis number 2 for the humidity.

The last line is defining how this graph should be drawn: On the right, 
starting from 0 up to 100.

``graph_options`` can have other usefull option. They are described in the 
documentation of `javascriptrrd <http://javascriptrrd.sourceforge.net/docs/javascriptrrd_v0.6.3/doc/lib/rrdFlot_js.html>`_.

After restarting RPi-Monotor with the command:

:: 

    service rpimonitor restart

You will see a new curve in Temperature graph as shown in the screenshot bellow:

.. figure:: _static/rpimonitortempethum.png
  :width: 400px 
  :align: center
  
  Graph with 2 Y axis: °C in left axis and % humidity (fixed from 0% to 100%) 
  on right axis
