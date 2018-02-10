Getting started
===============

Installation
------------

Installation using the repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**RPi-Monitor** is providing a debian repository. This repository will make 
installation and update accessible with the command ``apt-get`` or ``aptitude``.

To use this repository follow the instruction bellow:

Execute the following command to add RPi-Monitor into your list of repository: 

::

  sudo wget http://goo.gl/vewCLL -O /etc/apt/sources.list.d/rpimonitor.list

Install my public key to trust RPi-Monitor repository:

::

  sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 2C0D3C0F

To install **RPi-Monitor**, execute the following command:

::

  sudo apt-get update
  sudo apt-get install rpimonitor

.. note:: **RPi-Monitor** is designed to start automatically and collect metrics.
          The web interface is available on address http://IPaddress:8888.

Upgrade from the repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To upgrade **RPi-Monitor**, execute the following command:

::

  sudo apt-get update
  sudo apt-get upgrade


After installation you should excute the following command to update information 
about upgradable packages:

::

  sudo /etc/init.d/rpimonitor update

Manual installation from Debian package
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Download the latest package from the official repository in Github with the 
following command (replace latest_package_url by the real url fond on github):

::

    wget latest_package_url -O rpimonitor_latest_all.deb

If you have issue with GnuTLS: A TLS warning alert coming from Github you 
can download it with the following command:

::

    curl -L latest_package_url -o rpimonitor_latest_all.deb

Install the dependencies by executing the following command (use command 
``apt-get`` if ``aptitude`` is not available on your target system):

::

  sudo aptitude install librrds-perl libhttp-daemon-perl libjson-perl \
  libipc-sharelite-perl libfile-which-perl libsnmp-extension-passpersist-perl

Installation or upgrade can be done with the command:

::

  sudo dpkg -i rpimonitor_latest_all.deb

Complete the installation with the command:

::

  sudo /usr/share/rpimonitor/scripts/updatePackagesStatus.pl

Manual installation from sources
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note: TO BE COMPLETED (add link to package.rst)

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
.. note: TO BE COMPLETED (add link to snmp.rst)

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

Uninstallation
--------------
To uninstall **RPi-Monitor**, you can execute the following command:

::

    sudo apt-get remove rpimonitor

or:

::

    sudo apt-get purge rpimontor
