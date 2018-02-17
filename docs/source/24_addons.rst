:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/24_addons.rst

Addons configuration
====================

**RPi-Monitor** is providing addons. Addons are custom pages designed to give 
you the possibility to free your imagination and cutomise **RPi-Monitor** to your needs.

Addons are ``html`` pages, ``javascript`` and ``css`` directly integrated into **RPi-Monitor**.
The activation of an addon is done into **RPi-Monitor** configuration file. 

The following line is showing how to activate the default addons explaing addons feature: 

::

  web.addons.1.name=Addons
  web.addons.1.addons=about

It is possible to use an addon many time into a same configuration file 
(using different parameters if the addon support them).

The next part of this chapter shows some examples of addons and highlight
the possibilities of this feature.

Top3 Addon 
----------
 
Top3 is showing how to use addons to add additionnal information into status 
page. This addons is designed to periodically generate HTML content. This 
content can be accessible from the addons menu (if addon is configured in 
``rpimonotord`` configuration file) and/or can be inserted into status page 
using the function InsertHTML().


To activate this addon, add the following lines to your configuration file
 
::

  web.addons.2.name=Top3
  web.addons.2.addons=top3

and configure the ``cron`` of your Raspberry Pi to update the HTML content 
periodically. This can be done with the following lines:

::

  * * * * * root cd /usr/share/rpimonitor/web/addons/top3; ./top3 > top3.html

For deeper details, refer to rpimonitor manpage and to comments available into the script top3.

Example Addon
-------------

If you want to develop your own addon, you can refer to the example addons to 
see how to implement such a feature.
Example addon is providing a ``html`` page, a ``javacript`` and a ``css`` showing 
how an addon page can interact with **RPi-Monitor**.  

Example addon can activate by adding the following lines into the configuration file:

::

  web.addons.3.name=Addon example
  web.addons.3.addons=example
  web.addons.3.parameter=parameter_example















Shellinabox Addon
-----------------

Activating Shellinabox addon allow to have and access to shell inside browser.

::

  web.addons.4.name=ShelleInABox
  web.addons.4.addons=shellinabox

The behavior of this addon remain the same as previously embedded feature.

Custom Addon
------------

If you are not confortable with html, javascript and css, the addon custom may 
help you to customise RPi-Monitor to your wishes. This addons implement an 
iframe that can display any other web pages.

::

  web.addons.5.name=Custom addons
  web.addons.5.addons=custom
  web.addons.5.url=/addons/custom/custominfo.html

url is defining the page to be displayed into the iframe. It can be a file 
reachable from **RPi-Monitor** internal server or a site available into the Internet.

Webcam Addon
------------
If you want to see the image of your webcam in your brower, you can use hawkeye. 
Once hawkeye installed, it is very easy to add it into RPi-Monitor interface 
using the custom addon. The configuration will then be the following:

::

  web.addons.3.name=Webcam - Hawkeye
  web.addons.3.addons=custom
  web.addons.3.url=http://raspberry_adress:8000/

url parameter point to hawkeye web interface. If you are doing such a 
configuration, keep in mind about the security of your images. You should 
use the capacity of hawkeye to restrict the access to the image using a 
login and a password. You can also have a look to my article showing how
to secure the access to **RPi-monitor**. 