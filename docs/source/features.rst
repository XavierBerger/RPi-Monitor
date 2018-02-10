Keys features of RPi-Monitor
============================

**RPi** in **RPi-Monitor** stands for `Raspberry Pi`. This program was initially
designed to run on the small form factor computer. But it can, in reality run on
every computers running Perl.
Since the beginning **Rpi-Monitor** as been designed for embedded devices and
performances is the core of development strategy.

Configuration
  In **RPi-Monitor** everything is configurable

Collecting metrics
  **rpimonitord** is a daemon wich periodically gather, process and store metrics

Storing metrics 
  metrics are stored into a Round Robin Database (RRD). This ensure a fixed size for 
  the data storage and keep by default data over 1 year.

Read only mode
  If writing data on disk/eMMC/SSD/SDCard/... is not possible, **RPi-Monitor** 
  can be executed in read only mode. Metrics can be retrived either by web interface
  in json format or through SNMP. 

Presenting collected metrics
  **RPi-Monitor** embed a web server designed to present collected metrics.
  Instantaneous data are presented as a status page. Metrics stored into the RRD
  are presented as statistics pages. The web interface allow user to reoganise
  statistics by drag'n drop. Statistics page allow to zoom over graph to see 
  details of the mertics.
  Embedded web server can be disable and page can be served by an external web server.

Processing metrics and raising alerts
  **RPi-Monitor** embed an alert engine fully configurable and able to determine
  if metrics are out of expected range and raise alerts.
  definition of critera of alert detection as well as action to perform when alert
  is detected are fully configurable.

Sharing metrics with external monitoring system
  Metrics collected can be downloaded in json format (using the embedded web 
  server), read on disk or remotely accessed through snmp.

Extensible
  * Addons : Shellinabox, Hawkeye, top3...
  * Peeble
  * Docker
  * Yocto

