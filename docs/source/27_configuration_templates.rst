:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/31_customisation.rst

Configuration templates
=======================

**RPi-Monitor** comes with example files showing the capabilities of some features 
and functions available in status page. 
These files are installed into ``/etc/rpimonotor/templates/``
To see how a specific file is behaving, you can include this file into your 
configuration file using the ``include``. 

.. hint:: By default, files are included and commented out into ``data.conf``. 
          To activate them, you can simply uncomment them and restart ``rpimonitord``.

.. note:: Remember to restart RPi-Monitor to apply the configuration change:
  
  ::

    sudo /etc/init.d/rpimonitor restart

Page header
-----------

This function allow to define a custom logo, custom title.

Here is and example of configuration : ``/etc/rpimonitor/template/example.header.conf``

.. include:: ../../src/etc/rpimonitor/template/example.header.conf
  :literal:

``data.hostname`` is a value automatically extracted by **RPi-Monitor**. It is not 
needed to add a configuration.

The file ``avatar.png`` has been added into ``/usr/share/rpimonitor/web/img/``.

Here is the result:

.. figure:: _static/header001.png
   :align: center
   :width: 500px

.. seealso:: See defails in `Header customisation  <13_web.html#header-customisation>`_

Friends
-------

Add "friends" links **RPi-Monitor** running on different platform together.

A friend is simply another computer running **RPi-Monitor**. Configuring friends 
will add a drop down list on the right of the top menu with a links to 
**RPi-Monitor** sitting on the other computer.

.. figure:: _static/friends001.png
   :align: center
   :width: 500px

Each friend is identified by an ``id`` and is described by 2 parameters: ``<name>`` and ``<link>``.

Here is an example of configuration : ``/etc/rpimonitor/template/example.friends.conf``

.. include:: ../../src/etc/rpimonitor/template/example.friends.conf
   :literal:

.. figure:: _static/friends002.png
   :align: center

.. seealso:: See details in `Friends definition  <23_web.html#friends>`_

Badges and labels
-----------------

The functions ``Label`` and ``Badge`` are designed to write a text highligted by a color base on condition.

Here is an example of configuration : ``/etc/rpimonitor/template/example.badge_and_label.conf``

.. include:: ../../src/etc/rpimonitor/template/example.badge_and_label.conf
   :literal:

In this example, we monitor if the service ``ssh`` is listening on port ``22`` and display a 
label ``OK`` if yes or a label ``KO`` if not.

We do the same for **RPi-Monitor** on port ``8888`` and for ``nginx`` on port ``80`` and ``443``.

Information is extracted from the command ``netstat``.

The regular expression will return the port number if a service is listening 
on this port or nothing if no service is listenning on this port.

The results are accessible into javascript from the variable data. This 
variable is passed to the Label function as value.

For ssh, the condition is ``"==22"`` to check if the value is equal to 
``22`` or ``"!=22"`` to check if the value is different form ``22``. As only one of 
the condition will be ``true``, only one label will be displayed.

Other ports checking are using the same technic.

Here is the result:

.. image:: _static/label001.png
  :align: center






Multiple pages
--------------

Status and statistics can be sorted in pages. The parameter ``<page id>`` of
``web`` configuration is defining in which page data is displayed.


Here is an example of configuration : ``/etc/rpimonitor/template/example.multipage.conf``

.. include:: ../../src/etc/rpimonitor/template/example.multipage.conf
   :literal:

The new page will be accessible by a drop down menu as shown in the screenshot bellow.

.. figure:: _static/multipages001.png
   :align: center
   :width: 500px

   **RPi-Monitor** showing multiple status pages

.. figure:: _static/multipages002.png
   :align: center
   :width: 500px

   **RPi-Monitor** showing multiple graph pages










|
| 
|
|
|
|
|
|
| WORK IN PROGRESS
|
|
|
|
|
|
|
|
|








example.progressbar.conf 
------------------------

.. figure:: _static/examples003.png
    :width: 400px 
    :align: center

    Show warning and critical and colors 





|
| 
|
|
|
|
|
|
| WORK IN PROGRESS
|
|
|
|
|
|
|
|
|

example.justgage.conf
---------------------

.. figure:: _static/examples004.png
    :width: 400px 
    :align: center

    Show justgage and customisation

example.visibility.conf
-----------------------

.. figure:: _static/examples005.png
    :width: 400px 
    :align: center

    Show visibility feature

 












JustGageBar
-----------

A new widget is now available to display information in status page. Justgage is a handy JavaScript plugin for generating and animating nice & clean gauges. It is based on Raphaël library for vector drawing, so it’s completely resolution independent and self-adjusting.

::

  JustGageBar(title, label,min, value, max, width, height, levelColors, warning, critical)
 
To see how justgage behave, you can activate the configuration file ``example.justgage.conf``
 (Ref example explaination and screenshot upper).


Visibility
----------

A new parameter can be used in configuration file defining a visibility of a row:

::

  web.status.<page id>.content.<row id>.visibility=<visibility formula>

``<visibility formula>`` should be a valid javascript formula returning ``0`` to 
hide the row anything else but ``0`` show the row
