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

Since version 2.7:

* /etc/default/rpimonitor : *Init script configuration file*
* /etc/rpimonitor/daemon.conf : *configuration of rpimonitord daemon*
* /etc/rpimonitor/data.conf : *configuration of default data to be extracted and presented*
* /etc/rpimonitor/\*.conf : *all other *.conf file will be parsed to look for data to be monitored*
* /etc/rpimonitor/template/\*.conf : *data configuration template customized for different distribution and additionnal examples*

Some configuration files are provided for different distribution (raspbian, xbian, ...). These files are stored into the subdirectory /etc/rpimonitor/templates/. For supported distribution, the post installation script of package creates a link, data.conf, pointing to the configuration files dedicated to the distribution.


###Manpages

* /usr/share/man/man5/rpimonitord.conf.5.gz : *Manpage for rpimonitor and data extraction configuration*
* /usr/share/man/man1/rpimonitord.1.gz: *Manpage for rpimonitord command line usage*

###Web Interface

* /usr/share/rpimonitor
* /usr/share/rpimonitor/web : *Directory containing html (and json - cf note)*
* /usr/share/rpimonitor/web/js: *Directory containing javascripts*
* /usr/share/rpimonitor/web/css: *Directory containing style*
* /usr/share/rpimonitor/web/img: *Directory containing images*

###Data

* /usr/share/rpimonitor/web/stat : *Directory containing \*.rrd*
* /usr/share/rpimonitor/updatestatus.txt: * Current status of packages*

**Note:**

When **RPi-Monitor** is configured to not use the internal server, the json are writted down into the disk into the web root directory /usr/share/rpimonitor/web

**Discussion**: 
In issue #36, it has been suggested to move the data to /var/lib/rpimonitor/ and keep /usr/share/rpimonitor directory in read only.

###Additional scripts
I plan to add usefull user scripts directly inside the package.

* /usr/share/rpimonitor/scripts

