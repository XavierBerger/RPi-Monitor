Non standard configuration
==========================

Use it with my own Web Server
-----------------------------

In this example I will use nginx server. You could use the same tactic with your preferred web server.


Let's first update the configuration file to disable the embedded web server. Edit the file /etc/rpimonitord.conf and set daemon.noserver=1.


Then restart RPi-Monitor with the command:

    sudo service rpimonitor restart


The embedded server is no more running so, we will need to configure another server to access the data.


For nginx we will create the file /etc/nginx/sites-enabled/rpimonitor with the following content:


server {     listen 80;     index index.html;     root /usr/share/rpimonitor/web; }

and restart the server with the command:

    sudo service nginx restart


Now you can reach RPi-Monitor with your favorite browser on your favorite web server.


To go further, you can read the article RPi-Monitor: Build a multi-sites SSL certificate to improve user experience.


Use it into another Linux distribution 
--------------------------------------

RPi-Monitor has been designed to run into a Raspberry Pi but as it is using only standard Linux resources, it is not hardware dependent. A simple configuration update can make it run on Ubuntu, CentOS or any other distribution.


Ubuntu is a Debian based distribution as Raspbian. The installation can then be done using the deb package available for each releases. Download and install the package as described in this previous post.


With CentOS and withe any non Debian based distribution it will required to perform a manual installation.

First install the perl dependencies: HTTP::Daemon (perl-libwww-perl), RRD (rrdtool-perl) and JSON(perl-JSON)


Connect to github  and select the latest stable branch on the top left dropdown list.

Then download the code as zip file from the link "Download zip" visible at the bottom of the right menu.


Unpack it.

    unzip Version-2.x.zip


Finally install rpimonitor manually:

    su -

    mv Version-2.x/rpimonitor /usr/local


You can now start RPi-Monitor with the following commands:

    cd /usr/local/rpimonitor

    ./rpimonitird -c rpimonitor.conf -c default.conf


Note: I will not describe here how to configure the auto startup since each distribution has its own way to do so. An upstart script is available into RPi-Monitor github tools directory, it may help you in such an action.



Once the installation is done you can start RPi-Monitor and connect to it with your favorite browser.

You may notice that some values are undefined or displayed as NaN (Not a Number). To fix these issues, you will have to update the configuration file (rpimonitord.conf or default.conf in /etc/ + /etc/rpimonitord.conf.d or /usr/local/rpimonitor/ depending on your installation).


CentOS 6.3 before configuration file customisation




