.. RPi-Monitor documentation master file, created by
   sphinx-quickstart on Fri Feb  9 22:23:56 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

RPi-Monitor
===========

**RPi-Monitor** is a software designed to monitor the metrics from GNU/Linux 
system and connected peripherals. 
It store statistic into local Round Robin Database and embed a web server
allowing to display current status and statistics.
This documentation is presenting the features provided by **RPi-Monitor** and
explains how to install, configure and use it.

.. toctree::
   :maxdepth: 2
   :caption: Overview
   
   features
   gettingstarted

.. toctree::
   :maxdepth: 1
   :caption: Configuration

   daemon
   extraction
   web
   addons
   alert
   snmp

.. toctree::
   :maxdepth: 1
   :caption: Integration examples

   customisation
   examples
   autentication
   sensors
   lcd
   external
   
.. toctree::
   :maxdepth: 1
   :caption: To got further

   faq
   contributing
   packaging
   license
