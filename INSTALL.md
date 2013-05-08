# RPi-Monitor

**Author**: Xavier Berger

**Blog**: [RPi-Experience](http://rpi-experiences.blogspot.fr/)

## Prerequisite

Before installing **RPi-Monitor** you should install the dependencies. To do so, execute the following command:

    sudo apt-get install librrds-perl libhttp-daemon-perl libhttp-daemon-ssl-perl

## Package Installation

Refer to [README.md](https://github.com/XavierBerger/RPi-Monitor/blob/master/README.md).


## Manual installation

### Download

##### .zip Download

You can download this as a _.zip_ from the GitHub Repository via the following link:

    https://github.com/XavierBerger/RPi-Monitor/zipball/master

##### Git Clone

If you have Git installed you can clone the repository with the following command

    git clone https://github.com/XavierBerger/RPi-Monitor.git

### Manual start for testing

Start rpimonitord from directory _RPi-Monitor/rpimonitor_ with the command

    ./rpimonitord

That's it, your Raspberry Pi is monitored. You can now browse <http://your_Raspberry_Pi_address:8888> to
access to the interactive web interface.

### Installing rpimonitor as a daemon

If you want to start **RPi-Monitor** as a daemon at Raspberry Pi startup, copy the directory _rpimonitor_ in _/usr/local_

    sudo cp -a RPi-Monitor/rpimonitor /usr/local/rpimonitor

Copy the sysv startup script into _/etc/init.d_

    sudo cp RPi-Monitor/init/sysv/rpimonitor /etc/init.d/

To startup automatically **RPi-Monitor** at boot execute the following command to install strtup script:

    sudo update-rc.d rpimonitor defaults

**RPi-Monitor** will automatically start at next reboot. You can start it manually with the following command:

    sudo /etc/init.d/rpimonitor start

That's it, your Raspberry Pi is monitored. You can now browse <http://your_Raspberry_Pi_address:8888> to
access to the interactive web interface. Note: you can delete the directory _RPi-Monitor_ which is no more used.

The following command will allow you to manually stop the daemon:

    sudo /etc/init.d/rpimonitor stop

To remove rpimonitor, uninstall the service and delete the directory usung the following command:

    sudo update-rc.d rpimonitor remove
    sudo rm -fr /usr/local/rpimonitor

