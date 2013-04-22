# RPi-Monitor

**Author:** Xavier Berger

## About
RPi-Monitor is designed to run on [Raspberry Pi](http://raspberrypi.org). 



## Download

#### .zip Download

You can download this as a _.zip_ from the GitHub Repository via the following link: 

	https://github.com/XavierBerger/RPi-Monitor/zipball/master
    
#### Git Clone

If you have Git installed you can clone the repo

	git clone https://github.com/XavierBerger/RPi-Monitor.git
  
## Install

####Install rpimonitor daemon

Copy the directory rpimonitord into /usr/local/

Copy rpimonitord.conf into /etc/init/

Execute the following command to start the daemon

	sudo start rpimonitord

####Install the web interface

Copy directory rpimonitorweb into you web server.

Installation is done.

## Usage

When the daemon is running, you can check the current status in the file with the command:

	cat /usr/local/rpimonitor/rpimonitord.status

Browse http://<your Raspberry Pi address>/rpimonitor/ to access to the inteactive web interface
