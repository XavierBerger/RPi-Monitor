#Packaging

WORKING COPY - THE INFORMATION OF THIS DOCUMENT ARE NOT YET FULLY VALIDATED - YOUR COMMENTS ARE WELCOME INTO ISSUE #36

## Introduction
This document intended to help [**RPi-Monitor**](http://rpi-experiences.blogspot.fr/)'s package maintainer to know what to install and where.

## Dependencies
**rpimonitord** is a perl script which require the following perl modules to work:

 * librrds-perl
 * libhttp-daemon-perl
 * libjson-perl
 * libipc-sharelite-perl
 * libfile-which-perl

## Installation

###Programs

* /usr/bin/rpimonitord : *Daemon extracting data from the system and embedding the web application server - The help page is used to generate manpage*
* /etc/cron.d/rpimonitor : *daily extraction the status of package update  updating the file updatestatus.txt*
* /etc/init.d/rpimonitor : *sysVinit startup script*

**Note**: 

* **upstart** script is also avialable in the repository
* **systemd** script will be also available in the repository (yamakaki, à toi de jouer ;-) )

###Configuration

* /etc/rpimonitord.conf : *rpimonitord configuration - The comments of this file are used to generate manpage*
* /etc/rpimonitord.conf.d : *Directory storing data extraction configuration*
* /etc/rpimonitord.conf.d/default.conf: *Sample script doing data extraction for Raspberry Pi - The comments of this file are used to generate manpage*
* /etc/default/rpimonitor : *Startup script configuration*

**Discussion**: 

Suggested configuration organisation could be:

* /etc/default/rpimonitor : *Unchanged*
* /etc/rpimonitor/daemon.conf : *configuration of rpimonitord daemon*
* /etc/rpimonitor/\*.conf : *all other \*.conf file will be parsed to look for data to be monitored*. 

The file *default.conf* is provided with the package to have a working example when the program start. 
We could imagine to have many default.conf files into the repository. Up to the package maintainer to include the good one.

I prefer to keep the name *default.conf* rather than *data.conf* to differenciate it from customization.

Also, it would be better for end user to remove the constraint of *id* which have to be unique over all the configuration files... But this is not something trivial to develop.

###Manpages

* /usr/share/man/man5/rpimonitord.conf.5.gz : *Manpage for rpimonitor and data extraction configuration*
* /usr/share/man/man1/rpimonitord.1.gz: *Manpage for rpimonitord command line usage*

###Web Interface

* /usr/share/rpimonitor
* /usr/share/rpimonitor/web : *Directory containing html (and json - cf note)*
* /usr/share/rpimonitor/web/js: *Directory containing javascripts*
* /usr/share/rpimonitor/web/css: *Directory containing style *
* /usr/share/rpimonitor/web/img: *Directory containing images*

**Note:**

When **RPi-Monitor** is configured to not use the internal server, the json are writted down into the disk into the web root directory /usr/share/rpimonitor/web

###Data

* /usr/share/rpimonitor/web/stat : *Directory containing \*.rrd*
* /usr/share/rpimonitor/updatestatus.txt: * Current status of packages*

**Discussion**: 
It has been suggested to move the data to /var/lib/rpimonitor/

###Additional scripts
I plan to add usefull user scripts directly inside the package.

* /usr/share/rpimonitor/scripts

