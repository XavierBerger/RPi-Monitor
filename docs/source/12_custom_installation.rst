:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/12_custom_installation.rst
:wip:

Custom installation
===================

Installation from Debian package
--------------------------------
Download the latest package from the official repository in `Github
<https://github.com/XavierBerger/RPi-Monitor-deb/tree/master/packages>`_:

::

    wget https://goo.gl/yDYFhy -O rpimonitor_latest.deb

If you have issue with GnuTLS: A TLS warning alert coming from Github you can download it with the following command:

::

    curl -L https://goo.gl/yDYFhy -o rpimonitor_latest.deb

Install the dependencies by executing the following command (use command 
``apt-get`` or ``apt`` if ``aptitude`` is not available on your target system):

::

  sudo aptitude install librrds-perl libhttp-daemon-perl libjson-perl \
  libipc-sharelite-perl libfile-which-perl libsnmp-extension-passpersist-perl

Installation or upgrade can be done with the command:

::

  sudo dpkg -i rpimonitor_latest.deb

Complete the installation with the command:

::

  sudo /usr/share/rpimonitor/scripts/updatePackagesStatus.pl

Installing on Gentoo
--------------------
**Gentoo** users can find the `ebuild <https://github.com/srcshelton/gentoo-ebuilds/tree/master/www-apps/rpi-monitor>`_ created by Stuart Shelton.

Installing on Arch Linux
------------------------
**Arch Linux** users can find the `aur package <https://aur.archlinux.org/packages/rpimonitor/>`_ created by ajs124. 

Development branch package is located `here <https://aur.archlinux.org/packages/rpimonitor-dev-git/>`_

Installation from sources
-------------------------

For manual installation, refer to `Packaging <32_contributing.html#packaging>`_ 
instruction which describes how and where install files. 

Yocto
-----
.. todo:: Explain how to use meta-rpiexperiences.

Docker
------
.. todo:: Explain how to use docker.