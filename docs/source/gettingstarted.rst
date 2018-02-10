Getting started
===============

Installation
------------
From repository
^^^^^^^^^^^^^^^

From github
^^^^^^^^^^^

Manual Installation
^^^^^^^^^^^^^^^^^^^

Startup
-------

Command line
^^^^^^^^^^^^

::

    rpimonitord [-a address][ -b pidfile][[-c configuration_file]...][-d delay][-h][-k][-l logfile]
    [-m][-n][-p port][-s][-t timeout][-v[v[...]]][-V]


Options
^^^^^^^
.. tabularcolumns:: |l{5cm}|c{5cm}|p{10cm}|

+-----------------+--------------+------------------------------------------------------------------------+
|-a, --addr       |   address    | Web server bind address                                                |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default: 0.0.0.0                                                       |
+-----------------+--------------+------------------------------------------------------------------------+
|-b, --background |   pid file   | Define the pid file when run in background                             |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default: not set                                                       |
+-----------------+--------------+------------------------------------------------------------------------+
|-c, --conf       | conf file    | Define the configuration file                                          |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default: ``/etc/rpimonitor/data.conf`` ``/etc/rpimonitor/daemon.conf`` |
+-----------------+--------------+------------------------------------------------------------------------+
|-d, --delay      | delay        | Delay between check ins seconds                                        |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default : 10                                                           |
+-----------------+--------------+------------------------------------------------------------------------+
|-l, --logfile    | log file     | Logfile directory and prefix (ex: /var/log/rpimonitor)                 |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default:                                                               |
+-----------------+--------------+------------------------------------------------------------------------+
|-p, --port       | port         | Web server port                                                        |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default: 8888                                                          |
+-----------------+--------------+------------------------------------------------------------------------+
|-t, --timeout    | timeout      | KPI read timeout in seconds                                            |
|                 |              +------------------------------------------------------------------------+
|                 |              | Default: 5                                                             |
+-----------------+--------------+------------------------------------------------------------------------+

.. note:: If you want to change the default ``delay``, the rrd file will have to be deleted. 
          ``rpimonitord`` will recreate database at next startup with the new time slice.

+------------------+----------------------------------------------------------+
|-h, --help        | Shows this help and exit                                 |
+------------------+----------------------------------------------------------+
|-i, --interactive | Interactive configuration helper                         |
+------------------+----------------------------------------------------------+
|-k, --keep        | Keep log file (Default: logfile is delete at each start) |
+------------------+----------------------------------------------------------+
|-m, --mib         | Get MIB for current configuration                        |
+------------------+----------------------------------------------------------+
|-n, --noserver    | Don't start embeded web server                           |
+------------------+----------------------------------------------------------+
|-r, --readonly    | Read only mode.                                          |
+------------------+----------------------------------------------------------+
|-s, --show        | Show configuration as loaded and exit                    |
+------------------+----------------------------------------------------------+
|-v, --verbose     | Write debug info on screen                               |
+------------------+----------------------------------------------------------+
|-V, --Version     | Show version and exit                                    |
+------------------+----------------------------------------------------------+

Configuration
^^^^^^^^^^^^^
Configuration can be defined into ``/etc/rpimonitor/daemon.conf`` and
``/etc/rpimonitor/data.conf`` or in a list of files specified by ``-c`` parameter.
In ``/etc/rpimonitor/template/*.conf``, provided at installation, you can see 
how to customize rpimonitord.
Configuration defined inside a configuration file always overwrite default values.
Configuration given as option of the command line always overwrite the one defined into a file.

.. warning:: Be sure to use Linux filefeed format with line ending with LF (and not CR/LF like in Windows)

See next chapter for datail about configuration.

SNMP
^^^^
.. warning:: To be completed

Raw data access
^^^^^^^^^^^^^^^
Once ``rpimonitird`` is started the data representing the current status are 
available in json format and can be downloaded from the root of the web interface 
(ex: http://RpiAddress:8888/static.json)
* ``static.json`` : Static information extracted at startup
* ``dynamic.json`` : Current values of dynamic information extracted periodically
* ``menu.json`` : Description of menus when multiple pages are configured

The web interface configuration can also be downloaded in json format:
* ``statistics.json`` : Description of statistics page
* ``status.json`` : Description of status page
* ``friends.json`` : List of friends
* ``addons.json`` : List of addons

Statistic information are stored into RRD file available in the directory ``/var/lib/rpimonitor/stat/``
