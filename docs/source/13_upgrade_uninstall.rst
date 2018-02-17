:github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/13_upgrade_uninstall.rst

Upgrade or uninstall
====================

Upgrade from the repository
---------------------------

If you have performed an `installation from repository <11_first_installation.html#installation-from-repository>`_
you can upgrade **RPi-Monitor** with the following command:

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
