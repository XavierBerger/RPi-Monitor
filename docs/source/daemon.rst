Daemon configuration
====================
Section 'daemon' is defining the behavior of rpimonitord. It defines
if embedded server should be started and its configuration.

daemon.sharedmemkey=20130906
  Define the share memory key (Default:20130906)

daemon.delay=10
  Define the delay between 2 kpi pooling (Default:10)
  Note: If you want to change the default delay, the rrd file will
  have to be deleted rpimonitord will recreate them at next startup

daemon.timeout=10
  Define the maximul duration of KPI extraction (dDefault:5)

daemon.noserver=1
  Define that rpimonitord shouldn't start web server (Default:0)
  Note: A symbolic link from /var/lib/rpimonitor/stat to
        /usr/share/rpimonitor/web/stat may be required

daemon.readonly=1
  Tell rpimonitord to not run internal server (daemon.noserver=1) and
  not write data on disk. (Default:0)

daemon.addr=0.0.0.0
  Define the address used by the web server (Default:0.0.0.0)

daemon.port=8888
  Define port of the web server (default:8888)

daemon.user=pi
  Define user used to run the server process (Default:pi)
  Note: If user is not existing, process will run with uid=1000

daemon.group=pi
  Define group used to run the server process (Default:pi)
  Note: If group is not existing, process will run with gid=1000

daemon.webroot=/usr/share/rpimonitor/web
  Define the root directory of the web server (Default:/usr/share/rpimonitor/web)

daemon.datastore=/var/lib/rpimonitor
  Define the data storage directory (Default:/var/lib/rpimonitor)

daemon.logfile=/var/log/rpimonitor
  Define directory where logs are stored (Default:/var/log/rpimonitor)

daemon.shellinabox=https://0.0.0.0:4200/
  Define shellinabox address (Default: calculated automatically based on http request)



