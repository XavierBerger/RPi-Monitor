***
**WARNING:**

**RPi-Monitor is not officially released, if you found this repository, you can try it but keep in mind that I'm still developping this tool and fixing bugs...**
***

# RPi-Monitor

**Author**: Xavier Berger
**Blog**: [RPi-Experience](http://rpi-experiences.blogspot.fr/)

![screenshot](index.png)
![screenshot](status.png)
![screenshot](statistics.png)

## About

**RPi-Monitor** is a self monitoring application designed to run on [Raspberry Pi](http://raspberrypi.org).

For performance and security reason, **RPi-Monitor** separates the extraction of the information from the
presentation of the information.

The extraction of the information is done by a perl script design to run as a daemon. This script is
extracting the key performance indicators (KPI) from the computer and store in various files.
The latest extracted information is stored into a JSON file and all extracted information is
also written into a Round Robin Database (RRD) for history.

The presentation of the information is performed by HTML5 pages. This page dynamically download the
information extracted from the previous script and perform the rendering the in a nice looking format
(using [bootstrap](http://twitter.github.io/bootstrap/), [jquery](http://jquery.com/),
[jsqrencode](https://code.google.com/p/jsqrencode/) and [javascriptrrd](http://javascriptrrd.sourceforge.net/)).

This architecture has the advantage in an embedded architecture to offload the server task and delegate processing and rendering to the client.

You may notice that The look and feel of the status page is clearly inspired by [Raspcontrol](href="https://github.com/Bioshox/Raspcontrol).

## Download

#### .zip Download

You can download this as a _.zip_ from the GitHub Repository via the following link:

  https://github.com/XavierBerger/RPi-Monitor/zipball/master

#### Git Clone

If you have Git installed you can clone the repo

  git clone https://github.com/XavierBerger/RPi-Monitor.git

## Usage

Start rpimonitord from directory rpimonitor web with the command

  ./rpimonitord &

When the rpimonitord is running, you can check the current status in the file with the command:

  cat rpimonitord.status

Start the web server by excuting the following command

  ./start.sh

You can now browse <http://your_Raspberry_Pi_address:8888> to access to the interactive web interface.

## Future development

Future development will make installation and usage easier. It will start rpimonitord as daemon and will add additionnal feature to the web interface.
