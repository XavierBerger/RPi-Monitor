#!/bin/bash
#
# A20/AXP209 SoC/HDD/PMU temperature daemon. Writes the current temperatures 
# to /tmp/soctemp, /tmp/pmutemp and /tmp/disktemp (since we're experiencing 
# always timeouts under heavy load when trying to get the temperatures
# directly from within RPi-Monitor.
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
CheckAllDisks=FALSE    # if set to anything else than FALSE you've to adjust
                       # your data collection settings: both name and regexp. And
                       # display/graph settings should also match the count of 
                       # disks since the values for all found disks will be written
                       # space delimited to the temp file. With 4 disks you might
                       # use
                       # dynamic.12.name=hddtemp1,hddtemp2,hddtemp3,hddtemp4
                       # dynamic.12.source=/tmp/disktemp
                       # dynamic.12.regexp=^(\S+)\s(\S+)\s(\S+)\s(\S+)

export PATH=/usr/local/bin:/usr/bin:/bin:
unset LANG

Main() {
	# Ensure that we're running as root since otherwise querying SATA/USB disks won't work
	if [ "$(id -u)" != "0" ]; then
		echo "This script must be run as root" >&2
		exit 1
	fi
	
	# ensure we're writing to files instead of symlinks
	CreateTempDir
	
	while true ; do
		# check disk temperature. Either just sda or all block devices available -- see above.
		if [ "X${CheckAllDisks}" = "XFALSE" ]; then
			DiskTemp=$(GetDiskTemp /dev/sda)
			SanitizeValue ${DiskTemp} >/tmp/disktemp
		else
			DiskTemp=""
			for diskdevice in /sys/block/sd* ; do
				RawDiskTemp=$(GetDiskTemp /dev/${diskdevice##*/})
				DiskTemp="${DiskTemp}$(SanitizeValue ${RawDiskTemp}) "
			done
			echo "${DiskTemp}" >/tmp/disktemp
		fi
		
		# Soc and PMU temp -- depends on the kernel we're running
		case $(uname -r) in
			3.4.*)
				if [ -x /usr/share/rpimonitor/scripts/sunxi_tp_temp ]; then
					SoCTemp=$(/usr/share/rpimonitor/scripts/sunxi_tp_temp ${SoCTempAdjustment} | awk '{printf ("%0.0f",$1*1000); }')
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
			PMUTemp=$(sensors | awk -F" " '/CHIP: / {printf ("%0.0f",$2*1000); }')
		fi
		SanitizeValue ${SoCTemp} >/tmp/soctemp
		SanitizeValue ${PMUTemp} >/tmp/pmutemp
		sleep 5
	done
} # Main

GetDiskTemp() {
	# get disk temperate using hddtemp (doesn't wake up sleeping disks). The commented 
	# smartctl call is for USB disks in external enclosures that are able to answer
	# S.M.A.R.T. queries:
	# /usr/sbin/smartctl -d auto -a ${1} | awk -F" " '/Temperature_Celsius/ {printf ("%0.0f",$10*1000); }'
	/usr/sbin/hddtemp -n ${1} 2>/dev/null | awk '{printf ("%0.0f",$1*1000); }'
} # GetDiskTemp

SanitizeValue() {
	# return empty values as empty and keep thermal values in the range of 0°C-100°C
	if [ "X${1}" = "X" ]; then
		echo ""
	fi
	if [ ${1} -lt 0 ]; then
		echo -n 0
	elif [ ${1} -gt 100000 ]; then
		echo -n 100000
	else
		echo -n ${1}
	fi
} # SanitizeValue

CreateTempDir() {
	# create a safe temporary dir with the three files and symlinks to them below /tmp/
	MyTempDir=$(mktemp -d /tmp/rpimonitor.XXXXXX)
	if [ ! -d "${MyTempDir}" ]; then
		MyTempDir=/tmp/rpimonitor.$RANDOM.$RANDOM.$RANDOM.$$
		(umask 077 && mkdir ${MyTempDir}) || (echo "Failed to create temp dir. Aborting" >&2 ; exit 1)
	fi
	for file in soctemp disktemp pmutemp ; do
		touch "${MyTempDir}/${file}"
		chmod 644 "${MyTempDir}/${file}"
		chown root "${MyTempDir}/${file}"
		ln -f -s ${MyTempDir}/${file} /tmp/${file}
	done
	chmod 711 "${MyTempDir}"
} #CreateTempFiles

Main
