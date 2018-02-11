Web interface configuration
===========================

Friends
-------
Friends are defining a displayed name and a link reachable from a
top left menu visible if at least one friends is configured. Each
friend is identified by its ``<id>`` and is described by the 2 following
parameters

**web.friends.<id>.name=<display name>**

**web.friends.<id>.link=<link to RPi-Monitor>**

web.friends.<id>.name=<display name>
  <display name> is the name printed into the drop down menu

web.friends.<id>.link=<link to RPi-Monitor>
  <link to RPi-Monitor> is the link to another RPi-Monitor running
  into the friend machine.

Pages
-----
web.page.icon=<icon location relative to webroot>
  <icon location relative to webroot> is the path and filename of
  the icon to be displayed into RPi-Monitor title bar

web.page.menutitle=<menu title>
  <menu title> javascript code defining the text displayed into
  RPi-Monotor title bar. This code can use status information with
  the keyword 'data' including the 'data.hostname' available natively

web.page.pagetitle=<page title>
  <page title> javascript code defining the text displayed into
  tab and window title bar. This code can use status information with
  the keyword 'data' including the 'data.hostname' available natively

The status page is fully configurable.
It is possible to define multiple pages. Each page is identified by
its <page id>.

Status
------
web.status.<page id>.name=<page name>
  <page name> name of the page displayed into the drop down menu in
  case of multiple pages.

Status page is split in strips displaying information. Each status
strip is identified by a unique <status id>. Each status strip is
defined by a name, an icon and a serie of lines described as follow:

web.status.<page id>.visibility=<visibility formula>

<visibility formula> should be a valid javascript formula returning
  0: to hide the row
  anything else but 0: show the row

**web.status.<page id>.content.<status id>.name=<display name>**

**web.status.<page id>.content.<status id>.icon=<display icon>**

web.status.<page id>.content.<status id>.line.<line number>=<parameter>

web.status.<page id>.content.<status id>.name=<display name>
  <display name> Name displayed as title of the strip

web.status.<page id>.content.<status id>.icon=<display icon>
  <display icon> Icon of the strip

web.status.<page id>.content.<status id>.line.<line number>=<parameter>
  <line number> represent the position of the line within the strip.
  This number has to be unique within the strip.
  <parameter> is describing the content of the line. This parameter
  will be evaluated by the javascript command with the function
  eval() theirfore parameter should be valid javacript.
  To have  clean rendering, RPi-Monitor web interface provides some
  functions that could be used inside the parameter. The object data
  is also available and contains the result of dynamic and static
  extracted as described in the KPI extraction section.

  Functions provided by RPi-Monitor are the following:

      Uptime(uptime in sec)
        Print the uptime from seconds to the following format:
        XX year XX days XX hours XX minutes XX seconds

      Pad(value)
        Add a prefixed 0 for number smaller than 10

      KMG(value, pre)
        Print value in kilo, Mega, Giga, Peta.
        pre can be 'k', 'M', 'G' or 'P' depending on the value.

      Percent(value,total)
        Print percentage of value compared to total

      ProgressBar(value,total,warning, danger)
        Draw a progressbar representing the value compared to total.
        [=========------------]
        The default color of pregressbar is blue.
        If warning value is lower than critical, progressbar color will
        be orange if percentage is higher than warning value and red
        if the percentage is higher than danger value
        If warning value is higher than critical, progressbar color will
        be orange if percentage is lower than warning value and red
        if the percentage is lower than danger value

      JustGageBar(title, label,min, value, max, width, height, levelColors, warning, critical)
        Draw a half-circular gauge
        title       : Title of the gauge (located on to of the gauge)
        label       : Label of the gauge (located under the value)
        min         : min value of the gauge
        value       : value to be drawn
        max         : max value of the gauge
        width, height : size of the gauge
        levelColors : Array defining colors of each level [normal,warning,critical]
                      (in Hex format), default: green, orange and red.
                      Default colors are available into the array ``percentColors``.
        warning     : Warning level (in %) used to define color (default: 33)
        critical    : Critical  level (in %) used to define color (default: 66)

      Plural (value)
        Print 's ' if value > 1 or ' ' if not.

      Clock(data.localtime)
        This function is a little bit particular and should be written
        and should be written exactly as in the upper line. It will
        display on screen the current time and will simulate the
        seconds by incrementing them periodically.

      Label(data,formula, text, level)
      Badge(data,formula, text, level)
        This function will write a label/badge with a defined
        background color if the formula return TRUE.
        data    : data to use with the formula
        formula : formula evaluated in regards to data to determine
                  if label/badge has to be printed
        text    : text to be displayed
        level   : 'default' (grey), 'primary' (blue label/grey badge),
                  'success' (green), 'info' (cyan), 'warning' (orange)
                  or 'danger' (red)

      InsertHTML(url)
        This function is used to insert an HTML information inside
        a page. (Ref Top3 example showing top most process cpu usage)

The statistic page is fully configurable.
It is possible to define multiple pages. Each page is identified by
its <page id>.

web.status.<page id>.name=<page name>
  <page name> name of the page displayed into the drop down menu in
  case of multiple pages.

Statistics
----------
The statistic page displays statistics graphs. The graphs are
identified an unique <statistic id> and by the following parameters.

web.statistics.<page id>.content.<statistic id>.name=<statistic name>
  <statistic name> is the name of the statistics displayed in the
  top left drop down list.

web.statistics.<page id>.content.<statistic id>.graph.<rrd id>=<data name>
  <rrd id> is identifying the graph and is unique per <statistic id>
  <data name> is the name of the dynamic and static extracted as
  described in the KPI extraction section.

web.statistics.<page id>.content.<statistic id>.ds_graph_options.<data name>.label=<label>
  <data name> same as the previous <data name>
  <label> Label to display in legends. It is possible to setup other parameters
  of ds_graph_options. Refer to the following web page for details:
  http://javascriptrrd.sourceforge.net/docs/javascriptrrd_v0.5.0/doc/lib/rrdFlot_js.html

web.statistics.<page id>.content.<statistic id>.graph_options.<parameter>=<value>
  <parameter> and <value> can be find into the same web page as previous
  parameter. This allow to customize the graph and axis.

Example file are available in the template directory (prefixed by 'example').
To understand how a feature is behaving, you can include this example file
using the 'include' directive.
These include directive are already written (commented) into the default
configuration file: raspbian.conf
When configuration files change, it is required to restart rpimonitor.

