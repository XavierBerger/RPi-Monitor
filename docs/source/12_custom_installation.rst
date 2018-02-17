:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/03_custom_installation.rst

Custom installation
===================

Installation from Debian package
--------------------------------
Download the latest package from the official repository in `Github
<https://github.com/XavierBerger/RPi-Monitor-deb/tree/master/packages>`_
with the following command (replace ``latest_package_url`` by the real url found on github):

::

    wget latest_package_url -O rpimonitor_latest_all.deb

If you have issue with GnuTLS: A TLS warning alert coming from Github you 
can download it with the following command:

::

    curl -L latest_package_url -o rpimonitor_latest_all.deb

Install the dependencies by executing the following command (use command 
``apt-get`` if ``aptitude`` is not available on your target system):

::

  sudo aptitude install librrds-perl libhttp-daemon-perl libjson-perl \
  libipc-sharelite-perl libfile-which-perl libsnmp-extension-passpersist-perl

Installation or upgrade can be done with the command:

::

  sudo dpkg -i rpimonitor_latest_all.deb

Complete the installation with the command:

::

  sudo /usr/share/rpimonitor/scripts/updatePackagesStatus.pl

Installation from sources
-------------------------

For manual installation, refer to `Packaging <32_contributing.html#packaging>`_ 
instruction which describes how and where install files. 
