# [**RPi-Monitor on sunxi**](http://rpi-experiences.blogspot.fr/) 

### Overview

[**RPi-Monitor**](http://rpi-experiences.blogspot.fr/) is a self monitoring application designed to run on [Raspberry Pi](http://raspberrypi.org).

With a few adjustments it can also be used on numerous [sunxi devices](http://linux-sunxi.org/Main_Page) that are using the [A10](http://linux-sunxi.org/Category:A10_Boards), [A13](http://linux-sunxi.org/Category:A13_Boards) or [A20](http://linux-sunxi.org/Category:A20_Boards) SoC since they all feature the same power management unit [AXP209](http://linux-sunxi.org/AXP209).

### Installation/Configuration

All you have to do is to relink RPi-Monitor's `data.conf` to `sunxi_axp209.conf`, ensure that `/usr/share/rpimonitor/scripts/sunxi-temp-daemon.sh` is running as root and restart the *rpimonitor* service/daemon afterwards:

	# stop rpimonitor
	ln -f -s /etc/rpimonitor/template/sunxi_axp209.conf /etc/rpimonitor/data.conf
	nohup /usr/share/rpimonitor/scripts/sunxi-temp-daemon.sh &
	# start rpimonitor

You should ensure that the `sunxi-temp-daemon.sh` daemon is started at boot, eg. by adding `/usr/share/rpimonitor/scripts/sunxi-temp-daemon.sh &` to `/etc/rc.local` or creating an appropriate systemd service. We chose a daemon approach since otherwise it wasn't possible to gather thermal values of connected SATA disks and the SoC's temperature under high load. Now the daemon collects these thermal values in a loop and writes them to 3 files below temp where they can be fetched by rpimonitor.

### Monitoring disks

If you use a SATA disk and want its temperature to be monitored you'll need to install the *hddtemp* package since the daemon relies on the `/usr/sbin/hddtemp` binary. If you've a USB disk instead that is [able to be queried using S.M.A.R.T.](https://www.smartmontools.org/wiki/Supported_USB-Devices) then you might install the *smartmontools* package and replace the `hddtemp` call in `sunxi-temp-daemon.sh` with

	/usr/sbin/smartctl -d auto -a /dev/sda | awk -F" " '/Temperature_Celsius/ {print $10}'

(but using `hddtemp` is recommended since it doesn't wake up disks that are in standby/sleep mode). Using `smartctl` you can create data sources for any other [relevant S.M.A.R.T. attribute](https://en.wikipedia.org/wiki/S.M.A.R.T.#Known_ATA_S.M.A.R.T._attributes) you're interested in, especially those related to drive health. This is left as an excercise for the reader.

### Caveats

Most informations regarding the power management unit rely on the ability to query the AXP209 via I2C/sysfs. A driver for kernel 3.4 provides internal PMU informations below `/sys/devices/platform/sunxi-i2c.0/i2c-0/0-0034/` but unfortunately this is still missing in mainline kernel.

Informations regarding [cpufreq settings](http://linux-sunxi.org/Cpufreq) (CPU clock speed, governor) can only be queried if cpufreq support is built into the kernel. This should apply to all 3.4.x kernels and with mainline for A10/A13/A20 starting with kernel 4.0.

If you use mainline kernel 4.0 or above the SoC's temperature will be read out using `/sys/class/thermal/thermal_zone0/temp`. If you've applied the patches at the bottom of [this page](http://sunxi.montjoie.ovh) and installed the lm-sensors package it should be possible to read out at least the AXP209's internal thermal sensor (that is more reliable than the SoC's) when using mainline kernel.

### Author

**Author**: Thomas Kaiser
