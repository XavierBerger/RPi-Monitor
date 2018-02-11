# [**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) 

### Overview

[**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) is a self monitoring application designed to run on [Raspberry Pi](http://raspberrypi.org).

For performance and security reason, [**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) separates the extraction of the information from the presentation of the information.

The extraction of the information is done by a process designed to run as a daemon (which can be executed as root).
The extracted key performance indicators (KPI) from the computer are stored them into a Round Robin Database (RRD)
to keep an history of the health of the computer. rpimonitord is the perl script also starts the embedded web
server giving access to the pages. The web server is running into a separate process owned by a non root user
(the user 'pi' by default).

The presentation of the information is performed by HTML5 pages. These pages dynamically download the
information extracted from the previous script and perform the rendering the in a nice looking format
( using [bootstrap](http://twitter.github.io/bootstrap/), [jquery](http://jquery.com/),
[jsqrencode](https://code.google.com/p/jsqrencode/), [javascriptrrd](http://javascriptrrd.sourceforge.net/) and 
[flot](http://www.flotcharts.org/) ).

This architecture has the advantage in an embedded architecture to offload the server task and delegate
processing and rendering to the client.

Finnally note that the embedded server doesn't provide access control or authentication. It is still possible
to not start the embeded web server and use an external web server to deliver the pages.

### Screenshot

You can find screenshots of [**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) in [RPi-Monitor Overview](http://rpi-experiences.blogspot.fr/p/rpi-monitor.html).

### Installation

Installation of [**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) is detailled in every release announcement in [RPi-Experience](http://rpi-experiences.blogspot.fr/).

Debian package for **Raspbian** is available in [here](https://github.com/XavierBerger/RPi-Monitor-deb).

**Gentoo** users can find the ebuild created by Stuart Shelton [here](https://github.com/srcshelton/gentoo-ebuilds/tree/master/www-apps/rpi-monitor).

**Arch Linux** users can find the aur package created by ajs124 [here](https://aur.archlinux.org/packages/rpimonitor/). Developmental branch package is located [here](https://aur.archlinux.org/packages/rpimonitor-dev-git/)

The dependencies and the detail of installation process are describe into [PACKAGING.md](PACKAGING.md)

For installation on other system and for advanced customization read the article [RPi-Monitor: Version 2.0 advance usage and customization](http://rpi-experiences.blogspot.fr/2013/06/rpi-monitor-version-20-advance-usage.html).

Note: *"For various reasons"* **OpenElec** don't maintain a package repository. **RPi-Monitor** will then not be available on this distribution until the development team does the job.

### Other information

All articles related to RPi-Monitor are gathered into the page [RPi-Monitor Overview](http://rpi-experiences.blogspot.fr/p/rpi-monitor-articles.html).

Frequently Asked Question find answer into the [FAQ](http://rpi-experiences.blogspot.fr/p/rpi-monitor-faq.html) page.

### Development

GitHub is used to perform versioning of development and also to backup the development progress of future releases.

The branch **master** contains the latest stable version.

The branch **develop** is the unstable development branch (The branch may have bugs and partially released code that could avoid **RPi-Monitor** to run as expected). 

Each release is identified by a tag. 

### Pull request
You want to contribute to RPi-Monitor. I'll be happy to integrate your pull request. 

Please note: Pull request perfomed on **develop** branch will be integrated as soon as possible. Pull request perform on master branche may only be integrated when a new version is published (or not may not be integrated at all...)


### **RPi-Monitor** used in other projects

**RPi-monitor** is also used as part of other projects:

* **[Tor-Info](https://github.com/lzkill/tor-info)** Configuration file, script and documentation to extend **RPi-Monitor** for showing a Tor relay's information.


### Author

**Author**: Xavier Berger

* [RPi-Experience](http://rpi-experiences.blogspot.fr/)
* [What's up Doc](http://xberger.free.fr)
