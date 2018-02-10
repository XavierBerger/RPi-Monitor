Labels
======

.. image:: _static/label001.png
  :align: center

The goal of this function is to add a colored text reflecting the status of a service.

Label funtion overview
----------------------

The function Label is designed to write a text highligted by a color.

::

    Label(value, condition, text, level) 

This function determine if the label has to be displayed ot not base on a value
 (extracted by **RPi-Monitor**) and a condition. The label contains a text to 
 be displayed and a level. 6 levels of labels are available with 6 differences colors:

.. image:: _static/label002.png
  :align: center

How to use it?
--------------

The file ``/etc/rpimonitor/template/services.conf`` is showing an example of Label usage.

In this example, we monitor if the service ``ssh`` is listening on port ``22`` and display a 
label ``OK`` if yes or a label ``KO`` if not.

We do the same for **RPi-Monitor** on port ``8888`` and for ``nginx`` on port ``80`` and ``443``.

::

    ######################################################################## 
    # External daemons information added into Raspberry Pi page # icon from: 
    # http://www.iconseeker.com/search-icon/crystal-project-application/daemons.html 
    ######################################################################## 
    dynamic.16.name=ssh dynamic.16.source=netstat -nlt 
    dynamic.16.regexp=tcp .*:(22).*LISTEN 
    dynamic.17.name=rpimonitor 
    dynamic.17.source=netstat -nlt 
    dynamic.17.regexp=tcp .*:(8888).*LISTEN 
    dynamic.18.name=http 
    dynamic.18.source=netstat -nlt 
    dynamic.18.regexp=tcp .*:(80).*LISTEN 
    dynamic.19.name=https 
    dynamic.19.source=netstat -nlt 
    dynamic.19.regexp=tcp .*:(443).*LISTEN 
    web.status.1.content.9.name=Servers 
    web.status.1.content.9.icon=daemons.png 
    web.status.1.content.9.line.1="<b>ssh</b> : "+Label(data.ssh,"==22","OK","label-success")+Label(data.ssh,"!=22","KO","label-important")+" <b>rpimonitor</b> : "+Label(data.rpimonitor,"==8888","OK","label-success")+Label(data.rpimonitor,"!=8888","KO","label-important")+" <b>nginx http</b> : "+Label(data.http,"==80","OK","label-success")+Label(data.http,"!=80","KO","label-important")+" <b>nginx https</b> : "+Label(data.https,"==443","OK","label-success")+Label(data.https,"!=443","KO","label-important")


How does it work?
-----------------

Information is extracted from the command ``netstat``.

The regular expression will return the port number if a service is listening 
on this port or nothing if no service is listenning on this port.

Note: these regular expression may be optimised to return more accurrate result.


The results are accessible into javascript from the variable data. This 
variable is passed to the Label function as value.

For ssh, the condition is ``"==22"`` to check if the value is equal to 
``22`` or ``"!=22"`` to check if the value is different form 22. As only one of 
the condition will be ``true``, only one label will be displayed.

Other ports checking are using the same technic.

Example of Label function used to show server status

.. image:: _static/label001.png
  :align: center

As you see, the usage of this new function is quite easy. You can now 
imagine how to use it for your own needs.
