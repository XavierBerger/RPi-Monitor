Metrics extraction
==================
This part of the configuration file is defining which data to
extract how to extract them and when.

Specific 'include' keyword is available to add a file at the end of
the list of configuration files to be loaded.

include=<full path to configuration file>
  <full path to configuration file> is the full path to the
  configuration file to add at the end of the list of configuration
  files to be loaded.

Static KPI are extracted once at rpimonitord startup. Each statistic
is identified into the conf file by a line stating with the keyword
static and an identifier <static data id>

Each static KPI is defined by an id and with 4 parameters

static.<static data id>.name=<data name>
  <data name> is a string representing the KPI or the list of KPI
  separated by comma. Each name has to be unique.
  Only alpha numerical charter and underscore are accepted.

static.<static data id>.source=<data source>
  <data source> is a file or an executable file within the path.
  If the file exists, rpimonitord will read its content. If the file
  is not existing, rpimonirotd will try to execute it and will parse
  the output.
  Warning: specifying an executable by its absolute name will tell
  rpimonitord to read the content of the executable.1.graph.
  Note: In <data source> it is possible to refer to another <data name>
  with the prefix 'data.' followed by <data name>: 'data.<data name>'
  Example: 'data.kernel_version'
  This data could refer to dynamic or static KPI. The order of KPI
  extraction is important. Data used should already been extracted.

static.<static data id>.regexp=<data regexp>
  <data regexp> is the regular expression extracting information from
  data source. Regexp groups () has to be used to extract the data
  In case of KPI list, each group will be affected to a KPI name.

static.<static data id>.postprocess=<data postprocess>
  <data postprocess> is an expression defining the postprocessing to
  be applied on result. KPI are idendified by $1. In case of list,
  other KPI are identified by $2, $3 .graph..
  This parameter will be evaluate by the command eval of perl.

Dynamic KPI are extracted periodically (defined by daemon.delay)
Each statistic is identified into the conf file by a line stating
with the keyword dynamic and an identifier <dynamic data id>

Each dynamic KPI is defined by an id and with 5 parameters

**dynamic.<dynamic data id>.name=<data name>**

**dynamic.<dynamic data id>.source=<data source>**

**dynamic.<dynamic data id>.regexp=<data regexp>**

dynamic.<dynamic data id>.postprocess=<data postprocess>
  <data name>, <data source>, <data regexp>, <data postprocess>
  This 4 first parameters have the same signification as for static
  parameters.

.. note:: Static values are accessible for the post processing using the
          variable $this->{'static'}->{'static_data_name'} and can be used.
          You can refer to swap data extraction to see an example (cf. swap.conf).

dynamic.<dynamic data id>.interval=<interval>
  rpimonitors extracts data every "daemon.delay" seconds. <interval>
  define how many loop have to be waited before extracting this data.
  Default value is 1. This means that data is extracted at every loop.

dynamic.<dynamic data id>.default=<default>
  If rpimonitor can't extract information, it is now possible to define
  a <default> value which will be set for the KPI.

dynamic.<dynamic data id>.rrd=<GAUGE|COUNTER|DERIVE|ABSOLUTE|COMPUTE>
  The 5th parameter is defining if the KPI has to be stored into a RRD
  database and how <GAUGE|COUNTER|DERIVE|ABSOLUTE|COMPUTE>. If the
  parameter is defined as empty, no RRD database will be created. If
  this parameter is defined, a RRD database will be created and data
  will be stored at every extraction.
  Ref http://oss.oetiker.ch/rrdtool/doc/rrdcreate.en.html for RRD
  parameter description.

**dynamic.<dynamic data id>.min=<minimal value acceptable in RRD>**

dynamic.<dynamic data id>.max=<maximal value acceptable in RRD>
  If a value extracted by is less than minimal of greater than maximal
  value, it will be stored int RRD database as unknown.
  These limits are usefull to handle counter that fall down to 0 when
  they reach their limit (Ex: network graphs)

Note: Static values are accessible for the post processing using the
variable $this->{'static'}->{'static_data_name'} and can be used.
You can refer to swap data extraction to see an example.
