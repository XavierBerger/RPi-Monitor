WARNING: RPi-Monitor is not officially released, if you found this repository, you can try it but keep in mind that I'm still developping this tool and fixing bugs...


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

## Usage

Start rpimonitord from directory rpimonitor web with the command

	./rpimonitord &

When the rpimonitord is running, you can check the current status in the file with the command:

	cat rpimonitord.status

Start the web server by excuting the following command 

	./start.sh

You can now browse http://<your Raspberry Pi address>:8888 to access to the interactive web interface.

## Future development

Future development will make installation and usage easier. It will start rpimonitord as daemon and will add additionnal feature to the web interface.
