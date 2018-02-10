Use it with my own Web Server
=============================

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


