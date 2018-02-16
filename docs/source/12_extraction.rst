:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/12_extraction.rst

Metrics extraction configuration
================================
This part of the configuration file is defining which data to extract how to 
extract them and when.

.. note:: You will notice that metrics in **RPi-Monitor** are named **KPI**. 
          **KPI** means Key Performance Indicator.

Include
-------
Specific ``include`` keyword is available to add a file to the list of 
configuration files to be loaded.

include=<full path to configuration file>
  ``<full path to configuration file>`` is the full path to the
  configuration file to add at the end of the list of configuration
  files to be loaded.

Static
------
Static KPI are extracted once at rpimonitord startup. Each statistic
is identified into the conf file by a line stating with the keyword
static and an identifier ``<static data id>``

Each static KPI is defined by an id and with 4 parameters

static.<static data id>.name=<data name>
  ``<data name>`` is a string representing the KPI or the list of KPI
  separated by comma. Each name has to be unique.
  Only alpha numerical charter and underscore are accepted.

static.<static data id>.source=<data source>
  ``<data source>`` is a file or an executable file within the path.
  If the file exists, rpimonitord will read its content. If the file
  is not existing, rpimonirotd will try to execute it and will parse
  the output.
..  warning:: Specifying an executable by its absolute name will tell
              ``rpimonitord`` to read the content of the executable.

.. note:: In ``<data source>`` it is possible to refer to another ``<data name>``
          with the prefix ``data.`` followed by ``<data name>``: ``data.<data name>``

          **Example**: ``data.kernel_version``

          This data could refer to ``dynamic`` or ``static`` KPI. The order of KPI
          extraction is important. Data used should already been extracted.

static.<static data id>.regexp=<data regexp>
  ``<data regexp>`` is the regular expression extracting information from
  data source. Regexp groups ``()`` has to be used to extract the data
  In case of KPI list, each group will be affected to a KPI name.

static.<static data id>.postprocess=<data postprocess>
  ``<data postprocess>`` is an expression defining the postprocessing to
  be applied on result. KPI are idendified by ``$1``. In case of list,
  other KPI are identified by ``$2``, ``$3`` ``.graph.``.
  This parameter will be evaluate by the command eval of perl.

Dynamic
-------
Dynamic KPI are extracted periodically (defined by ``daemon.delay``)
Each statistic is identified into the conf file by a line stating
with the keyword dynamic and an identifier ``<dynamic data id>``

Each dynamic KPI is defined by an id and with 9 parameters

dynamic.<dynamic data id>.name=<data name>
  ``<data name>`` is a string representing the KPI or the list of KPI
  separated by comma. Each name has to be unique.
  Only alpha numerical charter and underscore are accepted.

dynamic.<dynamic data id>.source=<data source>
  ``<data source>`` is a file or an executable file within the path.
  If the file exists, rpimonitord will read its content. If the file
  is not existing, rpimonirotd will try to execute it and will parse
  the output.
  Warning: specifying an executable by its absolute name will tell
  rpimonitord to read the content of the executable.1.graph.

dynamic.<dynamic data id>.regexp=<data regexp>
  ``<data regexp>`` is the regular expression extracting information from
  data source. Regexp groups ``()`` has to be used to extract the data
  In case of KPI list, each group will be affected to a KPI name.

dynamic.<dynamic data id>.postprocess=<data postprocess>
  ``<data name>``, ``<data source>``, ``<data regexp>``, ``<data postprocess>``
  This 4 first parameters have the same signification as for static
  parameters.

.. note:: Static values are accessible for the post processing using the
          variable ``$this->{'static'}->{'static_data_name'}`` and can be used.
          You can refer to swap data extraction to see an example (cf. ``swap.conf``).

dynamic.<dynamic data id>.interval=<interval>
  ``rpimonitord`` extracts data every ``daemon.delay`` seconds. ``<interval>``
  define how many loop have to be waited before extracting this data.
  Default value is ``1``. This means that data is extracted at every loop.

dynamic.<dynamic data id>.default=<default>
  If rpimonitor can't extract information, it is now possible to define
  a ``<default>`` value which will be set for the KPI.

dynamic.<dynamic data id>.rrd=<GAUGE|COUNTER|DERIVE|ABSOLUTE|COMPUTE>
  The 5th parameter is defining if the KPI has to be stored into a RRD
  database and how ``<GAUGE|COUNTER|DERIVE|ABSOLUTE|COMPUTE>``. If the
  parameter is defined as empty, no RRD database will be created. If
  this parameter is defined, a RRD database will be created and data
  will be stored at every extraction.
  Ref `RRDTool documentation <http://oss.oetiker.ch/rrdtool/doc/rrdcreate.en.html>`_ for RRD
  parameter description.

**dynamic.<dynamic data id>.min=<minimal value acceptable in RRD>**

dynamic.<dynamic data id>.max=<maximal value acceptable in RRD>
  If a value extracted by is less than minimal of greater than maximal
  value, it will be stored int RRD database as unknown.
  These limits are usefull to handle counter that fall down to 0 when
  they reach their limit (Ex: network graphs)

.. note:: Static values are accessible for the post processing using the
          variable ``$this->{'static'}->{'static_data_name'}`` and can be used.
          You can refer to swap data extraction to see an example.

SNMP OID
--------

  **RPi-Monitor** is able to act as an snmp agent. Snmp configuration is based
  on KPI name. KPI could be ``static`` or ``dynamic``.

  snmp.<kpi name>.id=<id>
    ``<id>`` is the last number of OID appended at the end of OID configuration
    defined for snmp agent. (ref. SNMP agent configuration section)

  snmp.<kpi name>.type=<type>
    Type of data can be : ``counter``, ``counter64``, ``gauge``, ``integer``, 
    ``ipaddr``, ``ipaddress``, ``netaddr``, ``objectid``, ``octetstr``, 
    ``string``, ``timeticks``

  snmp.<kpi name>.description=<text description>
    Description of KPI to be added in MIB

  snmp.<kpi name>.postprocess=<formula>
    Post process formula to apply to KPI before sending over SNMP.
    Ex: Convert float to interger by mutiplying by 100: ``$1*100``

Commands to use to get MIB information:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  Snmp Configuration
    See configuration file example in ``/etc/snmp/snmpd.conf.rpimonitor``
    and activate pass_persist extension
  Extract MIB from RPi-Monitor
    ``rpimonitord -m > ~/mib.txt``
  Get data from SNMP
    ``snmpwalk -v 2c -m ~/mib.txt -c public 127.0.0.1 1.3.6.1.4.1.54321.42``