:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/02_gettingstarted.rst

Getting started
===============

Installation
------------

Installation using the repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**RPi-Monitor** is providing a debian repository. This repository makes 
installation and update accessible with the command ``apt-get`` or ``aptitude``.

To use this repository follow the instruction bellow:

Execute the following command to add **RPi-Monitor** into your list of repository: 

::

  sudo wget http://goo.gl/vewCLL -O /etc/apt/sources.list.d/rpimonitor.list

Install **RPi-Monitor**'s public key to trust **RPi-Monitor** repository:

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
Download the latest package from the official repository in Github
(https://github.com/XavierBerger/RPi-Monitor-deb/tree/master/packages)
with the following command (replace ``latest_package_url`` by the real url fond on github):

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

For manual installation, refer to `Packaging <32_contributing.html#packaging>`_ 
instruction which describes how and where install files. 

----------

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
how to customize ``rpimonitord``.

.. note:: Configuration defined inside a configuration file always overwrite default values.

.. note:: Configuration given as option of the command line always overwrite the one defined into a file.

.. warning:: Be sure to use Linux filefeed format with line ending with LF (and not CR/LF like in Windows)

See next chapter for datail about configuration.

snmp-agent
^^^^^^^^^^
``rpimonotord-snmp`` is the snmp agent provided by **RPi-Monitor**. This agent
allow ``snmpd`` to access to data exctracted by ``rpimonitord``.

Raw data access
^^^^^^^^^^^^^^^
Once ``rpimonitord`` is started the data representing the current status are 
available in json format and can be downloaded from the root of the web interface 
(ex: http://IPaddress:8888/static.json)

* ``static.json`` : Static information extracted at startup
* ``dynamic.json`` : Current values of dynamic information extracted periodically
* ``menu.json`` : Description of menus when multiple pages are configured

The web interface configuration can also be downloaded in json format:

* ``statistics.json`` : Description of statistics page
* ``status.json`` : Description of status page
* ``friends.json`` : List of friends
* ``addons.json`` : List of addons

Statistic information are stored into RRD file available in the directory ``/var/lib/rpimonitor/stat/``

--------------

Interactive Configuration Helper
--------------------------------
**RPi-Monitor** Interactive Configuration Helper is a tool embedded into 
``rpimonitord`` helping to create configuration files
. 
This article is detailling how to use it to monitor a ntfs volume.

First execute the following command:

``rpimonitord -i``

.. image:: _static/helper001.png

Press ``Enter``

.. image:: _static/helper002.png

Enter : ``df -t ntfs``

.. image:: _static/helper003.png

**RPi-Monitor** will tell you how it will process the source.
In our example, it will execute the command ``df``.
If it is correct, press ``Enter``, if not, enter ``no`` ( or ``No`` or ``n`` or ``N`` ) 
to go back to previous screen.

.. image:: _static/helper004.png

RPi-Monitor show you the ouput of the command as defined as source. If the 
output is the one expected press ``Enter``, if not, **RPi-Monitor** will ask you 
to define the source again.

.. image:: _static/helper005.png

By default the regulare expression is ``(.*)``. This will return all the 
data given by the source.
In the following screen you will see how we will find the regular expression 
extracting the available space of our ntfs drive step by step.

Step one, hit ``Enter`` to see what is given by the source by default.

.. image:: _static/helper006.png

The output is not the one expected hit ``Enter`` to define a new Regular expression.
The data is located after ``sda1``. Lets enter the following regular 
expression: ``sda1(.*)`` to get what is after ``sda1``.

.. image:: _static/helper007.png

The output is not the one expected yet hit ``Enter`` to define a new regular expression.
The data is located after ``sda1`` after some spaces ``\s+``, some numbers ``\d+``, 
some spaces ``\s+``, some numbers ``\d+``, some spaces`` \s+`` and is composed of numbers ``(\d+)``.
Enter then the following regulare expression: ``sda1\s+\d+\s+\d+\s+(\d+)``

.. image:: _static/helper008.png

The result is now the one expected , enter ``Yes`` ( or ``yes`` or ``Y`` or ``y`` )

.. image:: _static/helper009.png

We want the value in ``MB`` while is it given in ``kB``. We then need to devide it by ``1024``.
The formula is then: ``$1/1024``

.. image:: _static/helper010.png

This is the expected value, enter ``yes``

.. image:: _static/helper011.png

The value extracted is variable so ``dynamic`` so enter ``No``.

.. image:: _static/helper012.png

**RPi-Monitor** gives you the template of configuration. You now have to copy it 
into an existing configuration file or add a new file in
``/etc/rpimonitord.conf.d/`` and update the text inside ``<>``.

::

  dynamic.20.name=storage2_available
  dynamic.20.source=df -t ntfs
  dynamic.20.regexp=sda1\s+\d+\s+\d+\s+(\d+)
  dynamic.20.postprocess=$1/1024
  dynamic.20.rrd=GAUGE

Once the configuration will be apply, restart **RPi-Monitor** with the command:

``/etc/init.d/rpimonitor restart``

I hope this post is detailled enough to help you to configure **RPi-Monitor** to 
define the correct sources and regular expression.

----------------

Uninstallation
--------------
To uninstall **RPi-Monitor**, you can execute the following command:

::

    sudo apt-get remove rpimonitor

or:

::

    sudo apt-get purge rpimontor
