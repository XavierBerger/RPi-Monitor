:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/04_upgrade_uninstall.rst

Upgrade or uninstall
====================

Upgrade from the repository
---------------------------

To upgrade **RPi-Monitor**, execute the following command:

::

  sudo apt-get update
  sudo apt-get upgrade


After installation you should excute the following command to update information 
about upgradable packages:

::

  sudo /etc/init.d/rpimonitor update

Uninstallation
--------------
To uninstall **RPi-Monitor**, you can execute the following command:

::

    sudo apt-get remove rpimonitor

or:

::

    sudo apt-get purge rpimontor
