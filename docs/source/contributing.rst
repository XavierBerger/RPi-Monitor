
Contributing
=============

documentation
-------------

Install sphinx
^^^^^^^^^^^^^^

Propose a merge request
^^^^^^^^^^^^^^^^^^^^^^^
  * addons.rst
    * Details of provided addons
    * Screenshots
  * alert.rst
    * Example of script sending mail/sms ...
  * autentication.rst
    * Comment configuration
    * Add CA authority 
  * customisation.rst
    * To be reviewed
    * Add screenshots
  * contributing.rst
    * How to contribute to documentation
    * How to propose a merge request / new Feature
    * Report issue (on github)
  * daemon.rst
    * Review defautl values and example
  * examples.rst
    * To be reviewed
    * Add screenshots
  * external.rst
    * To be reviewed
  * extraction.rst
    * To be reviewed  
  * faq.rst
      * To be reviewed
  * features.rst
      * To be reviewed
  * gettingstarted.rst
      * To be reviewed
  * helper.rst
      * To be reviewed
  * index.rst
  * lcd.rst
      * To be reviewed
  * otherdistro.rst
      * To be reviewed
  * packaging.rst
      * To be reviewed
  * sensors.rst
      * To be reviewed
      * Adapt DS18B20 to new configuration file format
  * snmp.rst
      * To be reviewed
  * web.rst
      * To be reviewed
  
Generate documentation
^^^^^^^^^^^^^^^^^^^^^^

::

    make clean && make html && firefox build/html/index.html

Contribute to software
----------------------

Report issue
^^^^^^^^^^^^

Propose a merge request
^^^^^^^^^^^^^^^^^^^^^^^

GitHub is used to perform versioning of development and also to store the
development progress of future releases.

The branch master contains the latest stable version.

The branch ``develop`` is the unstable development branch (The branch may have bugs 
and partially released code that could avoid RPi-Monitor to run as expected).

Each release is identified by a tag.

You want to contribute to **RPi-Monitor**. I'll be happy to integrate your pull request.

Please note: Pull request perfomed on ``develop`` branch will be integrated as soon 
as possible. Pull request perform on master branche may only be integrated 
when a new version is published (or not may not be integrated at all...)


