:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/24_addons.rst

Addons configuration
====================

**RPi-Monitor** is providing addons. Addons are custom pages designed to give 
you the possibility to free your imagination and cutomise **RPi-Monitor** to your needs.

Addons are ``html`` pages, ``javascript`` and ``css`` directly integrated into **RPi-Monitor**.
The activation of an addon is done into **RPi-Monitor** configuration file. 

About Addon 
-----------

The following line is showing how to activate the default addons explaining addons feature: 

::

  web.addons.1.name=Addons
  web.addons.1.addons=about

To remove this addons, simply comment out or delete these lines.

It is possible to use an addon many time into a same configuration file 
(using different parameters if the addon support them).

The next part of this chapter shows some examples of addons and highlight
the possibilities of this feature.

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.

Top3 Addon 
----------
 
Top3 is showing how to use addons to add additionnal information into status 
page. This addons is designed to periodically generate HTML content. This 
content can be accessible from the addons menu (if addon is configured in 
``rpimonotord`` configuration file) and/or can be inserted into status page 
using the function ``InsertHTML()``.

To activate this addon, add the following lines to your configuration file
 
::

  web.addons.1.name=Top3
  web.addons.1.addons=top3

and configure the ``cron`` of your Raspberry Pi to update the HTML content 
periodically. This can be done with the following lines:

::

  * * * * * root cd /usr/share/rpimonitor/web/addons/top3; ./top3 > top3.html

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.

Example Addon
-------------

If you want to develop your own addon, you can refer to the example addons to 
see how to implement such a feature.
Example addon is providing a ``html`` page, a ``javacript`` and a ``css`` showing 
how an addon page can interact with **RPi-Monitor**.  

Example addon can activate by adding the following lines into the configuration file:

::

  web.addons.1.name=Addon example
  web.addons.1.addons=example
  web.addons.1.parameter=parameter_example

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.

Custom Addon
------------

If you are not confortable with html, javascript and css, the addon custom may 
help you to customise RPi-Monitor to your wishes. This addons implement an 
iframe that can display any other web pages.

  web.addons.<id>.name=<name>
    ``<name>``
  web.addons.<id>.addons=custom
    ``custom``
  web.addons.<id>.url=<url>
    ``url`` is defining the page to be displayed into the iframe. It can be a file 
    reachable from **RPi-Monitor** internal server or a site available into the Internet.
  web.addons.<id>.allowupdate=<allow update>
    ``<allow update>``

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.

Shellinabox
^^^^^^^^^^^

Shellinabox allow you to access to the shell of your Raspberry Pi through a web interface. 

::

    apt-get install shellinabox

By default shellinabox listening on http://raspberrypi.local:4200/. 
You can modify this address to point to your shellinabox address. 

This addons is simply perform shellinabox integration in **RPI-Monitor** Interface using ``iframe``.

::

  web.addons.1.name=ShelleInABox
  web.addons.1.addons=custom
  web.addons.1.url=https://raspberrypi.local:4200/
  web.addons.1.allowupdate=false

The behavior of this addon remain the same as previously embedded feature.

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.

Webcam 
^^^^^^

If you want to see the image of your webcam in your brower, you can use hawkeye. 
Once hawkeye installed, it is very easy to add it into **RPi-Monitor** interface 
using the custom addon. The configuration will then be the following:

::

  web.addons.1.name=Webcam - Hawkeye
  web.addons.1.addons=custom
  web.addons.1.url=http://raspberrypi.local:8000/

url parameter point to hawkeye web interface. If you are doing such a 
configuration, keep in mind about the security of your images. You should 
use the capacity of hawkeye to restrict the access to the image using a 
login and a password. You can also have a look to my article showing how
to secure the access to **RPi-monitor**.

.. important:: ``id`` has to start by 1 and incrementing. This is defining the order of addons with the menu.
