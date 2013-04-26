***
**WARNING:**

**RPi-Monitor is not officially released. If you found this repository, you can try it but keep in mind that
I'm waiting my Raspberry Pi delivery so the application is still in development and bug fix stage...**
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

The extraction of the information is done by a process designed to run as a daemon (which can be executed as root).
The extracted key performance indicators (KPI) from the computer are stored them into a Round Robin Database (RRD)
to keep an history of the health og the computer.

**rpimonitord** is the perl script designed to start the monitoring daemon and the embedded web server giving
access to the pages. The web server is running into a separate process owned by a non root user (the user 'pi' by default)

The presentation of the information is performed by HTML5 pages. These pages dynamically download the
information extracted from the previous script and perform the rendering the in a nice looking format
(using [bootstrap](http://twitter.github.io/bootstrap/), [jquery](http://jquery.com/),
[jsqrencode](https://code.google.com/p/jsqrencode/) and [javascriptrrd](http://javascriptrrd.sourceforge.net/)).
This architecture has the advantage in an embedded architecture to offload the server task and delegate
processing and rendering to the client.

You may notice that The look and feel of the status page is clearly inspired by
[Raspcontrol](https://github.com/Bioshox/Raspcontrol).

Finnally note that the embedded server doesn't provide access control or authentication. It is still possible
to not start the embeded web server and use an external web server to deliver the pages.

## Download

#### .zip Download

You can download this as a _.zip_ from the GitHub Repository via the following link:

    https://github.com/XavierBerger/RPi-Monitor/zipball/master

#### Git Clone

If you have Git installed you can clone the repo

    git clone https://github.com/XavierBerger/RPi-Monitor.git

## Usage

Start rpimonitord from directory _./rpimonitor_ with the command

    ./rpimonitord &

That's it, you Raspberry Pi is monitored. You can now browse <http://your_Raspberry_Pi_address:8888> to 
access to the interactive web interface.

## Future development

Future development will make installation and usage easier (yes, it is possible with debian package and upstart).

Additionnal feature will also be added into the web interface.
