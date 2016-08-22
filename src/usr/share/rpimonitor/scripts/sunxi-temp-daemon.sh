#!/bin/bash
#
# A20/AXP209 SoC/HDD/PMU temperature daemon. Writes the current temperatures 
# to /tmp/soctemp, /tmp/pmutemp and /tmp/disktemp (since we're experiencing 
# always timeouts under heavy load when trying to get the temperatures
# directly from within RPi-Monitor. All temperature values in °C were written
# to the temp files multiplied with 10 to get 1 decimal place in RPi-Monitor.
#
# Please keep in mind that the values you get this way may be inaccurate (that
# applies especially to the SoC's temperature)
#
# Copyright 2015 - Thomas Kaiser - http://kaiser-edv.de/
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

SoCTempAdjustment=1447 # default for A20
CheckInterval=7.5      # time in seconds between two checks
DiskCheckInterval=60   # time in seconds between disk checks
CheckAllDisks=FALSE    # if set to anything else than FALSE you've to adjust
                       # your data collection settings: both name and regexp. And
                       # display/graph settings should also match the count of 
                       # disks since the values for all found disks will be written
                       # space delimited to the temp file. With 4 disks you might
                       # use
                       #
                       # dynamic.12.name=hddtemp1,hddtemp2,hddtemp3,hddtemp4
                       # dynamic.12.source=/tmp/disktemp
                       # dynamic.12.regexp=^(\S+)\s(\S+)\s(\S+)\s(\S+)
                       #
                       # And please keep in mind that disk enumeration might not
                       # be persistent across reboots so become familiar with
                       # udev rules, access disks by UUID or use /dev/disk/by-id/
                       # 'blkid' and 'udevadm info --query=property --name=/dev/sda'
                       # are your friends and help you to get the idea.

export PATH=/usr/local/bin:/usr/bin:/bin:
unset LANG
LastDiskCheck=0

Main() {
	# Ensure that we're running as root since otherwise querying SATA/USB disks won't work
	if [ "$(id -u)" != "0" ]; then
		echo "This script must be run as root" >&2
		exit 1
	fi
	
	# ensure we're writing to files instead of symlinks
	CreateTempDir
	
	while true ; do
		# check disk temperature(s). We execute this only every ${DiskCheckInterval} since it's
		# a bit costly (S.M.A.R.T. queries). We check either /dev/sda or all available block
		# devices -- see above for contents/consequences of $CheckAllDisks
		TimeNow=$(( $(date "+%s") / ${DiskCheckInterval} ))
		if [[ ${TimeNow} -gt ${LastDiskCheck} ]]; then
			# time for a disk check. If ${CheckAllDisks} is FALSE and /dev/sda exists we
			# only query this device otherwise all available (might be none)
			if [ "X${CheckAllDisks}" = "XFALSE" -a -L /sys/block/sda ]; then
				DiskTemp=$(GetDiskTemp /dev/sda)
				SanitizeValue ${DiskTemp} >/tmp/disktemp
			else
				DiskTemp=""
				for diskdevice in /sys/block/sd* ; do
					RawDiskTemp=$(GetDiskTemp /dev/${diskdevice##*/})
					DiskTemp="${DiskTemp}$(SanitizeValue ${RawDiskTemp}) "
				done
				if [ "X${DiskTemp}" = "X " ]; then
					echo -n "0" >/tmp/disktemp
				else
					echo "${DiskTemp}" >/tmp/disktemp
				fi
			fi
			# update check timestamp
			LastDiskCheck=${TimeNow}
		fi
		
		# Soc and PMU temp -- depends on the kernel we're running
		case $(uname -r) in
			3.4.*)
				if [ -x /usr/share/rpimonitor/scripts/sunxi_tp_temp ]; then
					SoCTemp=$(/usr/share/rpimonitor/scripts/sunxi_tp_temp ${SoCTempAdjustment} | awk '{printf ("%0.0f",$1*10); }')
				fi
				read PMUTemp </sys/devices/platform/sunxi-i2c.0/i2c-0/0-0034/temp1_input
				;;
			4.*)
				# mainline kernel 4.0 or above, SoC temp should be available
				read SoCTemp </sys/class/thermal/thermal_zone0/temp
		esac
		
		# check whether PMU value could be read before
		if [ "X${PMUTemp}" = "X" ]; then
			# Maybe the patches from http://sunxi.montjoie.ovh are applied and lm-sensors installed
			PMUTemp=$(sensors | awk -F" " '/CHIP: / {printf ("%0.0f",$2*10); }')
		fi
		LastSocTemp=$(SanitizeValue ${SoCTemp} ${LastSocTemp} | tee /tmp/soctemp)
		LastPMUTemp=$(SanitizeValue $(( ${PMUTemp} / 100 )) ${LastPMUTemp} | tee /tmp/pmutemp)
		sleep ${CheckInterval}
	done
} # Main

GetDiskTemp() {
	# get disk temperate using hddtemp (doesn't wake up sleeping disks and knows how to deal
	# with different disks due to an included database with known disk models).
	
	/usr/sbin/hddtemp -n ${1} 2>/dev/null | awk '{printf ("%0.0f",$1*10); }'
	
	# The commented smartctl call below is meant as an alternative and an example for USB 
	# disks in external enclosures that are able to answer S.M.A.R.T. queries since they're 
	# SAT capable:
	#
	# /usr/sbin/smartctl -d sat -a ${1} | awk -F" " '/Temperature_Cel/ {printf ("%0.0f",$10*10); }'
	#
	# You should be aware that not every enclosure supports that and that some USB-to-SATA 
	# bridges require different parameters (eg. '-d usbjmicron' -- have a close look at
	# https://www.smartmontools.org/wiki/Supported_USB-Devices and test with smartctl to
	# get the correct value of the correct attribute).
	#
	# You should also be aware that a query by smartctl always wakes up sleeping disks. So 
	# in case you want to query an external USB disk only if it's neither standby nor sleeping
	# and in case the enclosure is SAT capable think about prefixing the smartctl call with 
	# something like:
	#
	# /sbin/hdparm -C ${1} | egrep -q "standby|sleeping" || /usr/sbin/smartctl ...
	#
	# In case you try to query multiple disks you might end up with something like
	#
	# case ${1} in
	#     /dev/sda) /usr/sbin/hddtemp -n ${1} ... ;;
	#     /dev/sdb) /usr/sbin/smartctl -d usbprolific -a ${1} ... ;;
	#     /dev/sdc) /sbin/hdparm -C ${1} | egrep -q "standby|sleeping" || /usr/sbin/smartctl -d sat ... ;;
	# esac
} # GetDiskTemp

SanitizeValue() {
	# keep thermal values in the range of 0°C-100°C since sometimes the values are massively out 
	# of range and then your graphs suffer from this. If a second argument is supplied then create
	# an average value to smooth graphs (useful for PMU and SoC)
	if [[ ${1} -lt 0 ]]; then
		echo -n 0
	elif [[ ${1} -gt 1000 ]]; then
		echo -n 1000
	else
		if [[ "X$2" = "X" ]]; then
			echo -n ${1}
		else
			echo -n $(( ( $1 + $2 + $2 ) / 3 ))
		fi
	fi
} # SanitizeValue

CreateTempDir() {
	# create a safe temporary dir with the three files therein and symlinks to /tmp/
	MyTempDir=$(mktemp -d /tmp/rpimonitor.XXXXXX)
	if [ ! -d "${MyTempDir}" ]; then
		MyTempDir=/tmp/rpimonitor.$RANDOM.$RANDOM.$RANDOM.$$
		(umask 077 && mkdir ${MyTempDir}) || (echo "Failed to create temp dir. Aborting" >&2 ; exit 1)
	fi
	for file in soctemp disktemp pmutemp ; do
		echo -n "0" > "${MyTempDir}/${file}"
		chmod 644 "${MyTempDir}/${file}"
		ln -f -s ${MyTempDir}/${file} /tmp/${file}
	done
	chmod 711 "${MyTempDir}"
} #CreateTempFiles

Main
