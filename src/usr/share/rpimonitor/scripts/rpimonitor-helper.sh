#!/bin/bash
#
# cpu load and dvfs daemon for H3
#
# Extracts dvfs information from script.bin and let a daemon later
# convert cpufreq into Vcore. Also generates cpuload statistics from
# /proc/stat since /proc/loadavg is not precise enough
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

CheckInterval=7.5       # time in seconds between two checks
DiskCheckInterval=60    # time in seconds between disk checks
CheckAllDisks=FALSE     # if set to anything else than FALSE you've to adjust
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

CpuStatCheckInterval=10 # define in which interval CPU statistics should be queried

TempCheckInterval=180   # In case you want to query external weather stations via HTTP
                        # define an interval here and adjust the GetExternalTemp function

# in case you're doing disk related tests and are interested in precise thermal measurements
# then uncomment the next line
# DiskCheckInterval=1

Main() {
	# preparations
	export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
	CheckPrerequisits "$@"

        # ensure we're writing to files instead of symlinks
        CreateTempDir

        # parse dvfs table and create GetVCore funtion
        ParseDVFSTable
        source /tmp/dvfs-table

	# start the infinite loop to collect data
	while true ; do
		# get VCore
		read CPUFreq </sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
		GetVCore ${CPUFreq} >/tmp/VCore

		# check disk temperature(s). We execute this only every ${DiskCheckInterval} since 
		# it's a bit costly (S.M.A.R.T. queries). 
		TimeNow=$(( $(date "+%s") / ${DiskCheckInterval} ))
		if [[ ${TimeNow} -gt ${LastDiskCheck} ]]; then
			# time for a disk check. If ${CheckAllDisks} is FALSE and /dev/sda exists we
			# only query this device otherwise all available (might be none)
			CheckDisks
			# update check timestamp
			LastDiskCheck=${TimeNow}
		fi

		# External temperature from weather stations
		# TimeNow=$(( $(date "+%s") / ${TempCheckInterval} ))
		# if [[ ${TimeNow} -gt ${LastTempCheck} ]]; then
			# read in external temp values from 2 different web sources
			# ExternalTemp=$(GetExternalTemp)
			# LastExternalTemp=$(SanitizeValue ${ExternalTemp} ${LastExternalTemp} | tee /tmp/externaltemp)
			# LastTempCheck=${TimeNow}
		# fi
		
		# cpustat
		TimeNow=$(( $(date "+%s") / ${CpuStatCheckInterval} ))
		if [[ ${TimeNow} -gt ${LastCpuStatCheck} ]]; then
			ProcessStats
			LastCpuStatCheck=${TimeNow}
		fi
		sleep ${CheckInterval}
	done
} # Main

CheckPrerequisits() {
	# prerequisits
	# write PID to pidfile, ensure deletion
	if [ $# -eq 1 ]; then
		echo $$ >"${1}"
		trap "rm \"${1}\" ; exit 0" 0 1 2 3 15
	fi

	# ensure bin2fex, links, hddtemp and smartmontools  are installed
	which links >/dev/null 2>&1 || apt-get -f -qq -y install links
	which bin2fex >/dev/null 2>&1 || apt-get -f -qq -y install sunxi-tools
	which hddtemp >/dev/null 2>&1 || apt-get -f -qq -y install hddtemp
	which smartctl >/dev/null 2>&1 || apt-get -f -qq -y install smartmontools

	Path2ScriptBin=/boot
	if [ ! -f "${Path2ScriptBin}/script.bin" ]; then
		Path2ScriptBin="$(df | awk -F" " '/^\/dev\/mmcblk0p1/ {print $6}')"
		if [ ! -f "${Path2ScriptBin}/script.bin" ]; then
	       		echo "Can not find script.bin. Ensure boot partition is mounted" >&2
			logger "Can not find script.bin. Ensure boot partition is mounted"
	        	exit 1
		fi
	fi
	unset LANG
	LastDiskCheck=0
	LastTempCheck=0
	LastUserStat=0
	LastNiceStat=0
	LastSystemStat=0
	LastIdleStat=0
	LastIOWaitStat=0
	LastIrqStat=0
	LastSoftIrqStat=0
	LastCpuStatCheck=0
} # CheckPrerequisits

ParseDVFSTable() {
	# extract DRAM and dvfs settings from script.bin
	bin2fex <"${Path2ScriptBin}/script.bin" 2>/dev/null | \
		egrep "^LV._|^LV_|extrem|boot_clock|_freq|^dram_" | \
		egrep -v "cpu_freq|dram_freq" | while read ; do
		echo "# ${REPLY}"
	done >/tmp/dvfs-table

	echo -e '\nGetVCore() {' >>/tmp/dvfs-table

	# parse /tmp/dvfs-table to get dvfs entries
	grep "^# LV._freq" /tmp/dvfs-table | sort -r | while read ; do
		set ${REPLY}
		CPUFreq=$4
		# if [ ${CPUFreq} -eq 0 ]; then
		#	echo -e "if [ \$1 -ge $(( ${CPUFreq} / 1000 )) ]; then\n\techo -n ${VCore}\nel\c" >>/tmp/dvfs-table
		#	break
		# else
		# 	VCore=$(grep -A1 "^# $2" /tmp/dvfs-table | tail -n1 | awk -F" " '{print $4}')
		# 	echo -e "if [ \$1 -ge $(( ${CPUFreq} / 1000 )) ]; then\n\techo -n ${VCore}\nel\c" >>/tmp/dvfs-table
		if [ ${CPUFreq} -ne 0 ]; then
			VCore=$(grep -A1 "^# $2" /tmp/dvfs-table | tail -n1 | awk -F" " '{print $4}')
			echo -e "if [ \$1 -le $(( ${CPUFreq} / 1000 )) ]; then\n\techo -n ${VCore}\nel\c" >>/tmp/dvfs-table
		fi
	done
	# VCore=$(grep -A1 "^# LV1_freq" /tmp/dvfs-table | tail -n1 | awk -F" " '{print $4}')
	echo -e "se\n\techo -n ${VCore}\nfi\n}" >>/tmp/dvfs-table
} # ParseDVFSTable

CreateTempDir() {
	# create a safe temporary dir with the three files therein and symlinks to /tmp/
	MyTempDir=$(mktemp -d /tmp/rpimonitor.XXXXXX)
	if [ ! -d "${MyTempDir}" ]; then
		MyTempDir=/tmp/rpimonitor.$RANDOM.$RANDOM.$RANDOM.$$
		(umask 077 && mkdir ${MyTempDir}) || (echo "Failed to create temp dir. Aborting" >&2 ; exit 1)
	fi
	for file in VCore cpustat externaltemp disktemp dvfs-table; do
		echo -n "0" > "${MyTempDir}/${file}"
		chmod 644 "${MyTempDir}/${file}"
		ln -f -s ${MyTempDir}/${file} /tmp/${file}
	done
	chmod 711 "${MyTempDir}"
} #CreateTempFiles

CheckDisks() {
	# We check either /dev/sda or all available block devices -- see above for 
	# contents/consequences of $CheckAllDisks
	if [ "X${CheckAllDisks}" = "XFALSE" -a -L /sys/block/sda ]; then
		DiskTemp=$(GetDiskTemp /dev/sda)
		LastDiskTemp=$(SanitizeValue ${DiskTemp} ${LastDiskTemp} | tee /tmp/disktemp)
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
} # CheckDisks

GetDiskTemp() {
	# get disk temperate using hddtemp (doesn't wake up sleeping disks and knows how to deal
	# with different disks due to an included database with known disk models).
	
	# RawTemp=$(/usr/sbin/hddtemp -n ${1} 2>/dev/null)
	RawTemp=$(/sbin/hdparm -C ${1} | egrep -q "standby|sleeping" || /usr/sbin/smartctl -d sat -a ${1} | awk -F" " '/Temperature_Cel/ {printf ("%0.0f",$10); }')
	if [ "X${RawTemp}" = "X" ]; then
		# drive is sleeping, we return 0
		echo 0
	else
		echo ${RawTemp} | awk '{printf ("%0.0f",$1*1000); }'
	fi
	
	# The commented smartctl call below is meant as an alternative and an example for USB 
	# disks in external enclosures that are able to answer S.M.A.R.T. queries since they're 
	# SAT capable:
	#
	# /usr/sbin/smartctl -d sat -a ${1} | awk -F" " '/Temperature_Cel/ {printf ("%0.0f",$10); }'
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

ProcessStats() {
	set $(awk -F" " '/^cpu / {print $2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' </proc/stat)
	UserStat=$1
	NiceStat=$2
	SystemStat=$3
	IdleStat=$4
	IOWaitStat=$5
	IrqStat=$6
	SoftIrqStat=$7
	
	UserDiff=$(( ${UserStat} - ${LastUserStat} ))
	NiceDiff=$(( ${NiceStat} - ${LastNiceStat} ))
	SystemDiff=$(( ${SystemStat} - ${LastSystemStat} ))
	IdleDiff=$(( ${IdleStat} - ${LastIdleStat} ))
	IOWaitDiff=$(( ${IOWaitStat} - ${LastIOWaitStat} ))
	IrqDiff=$(( ${IrqStat} - ${LastIrqStat} ))
	SoftIrqDiff=$(( ${SoftIrqStat} - ${LastSoftIrqStat} ))
	
	Total=$(( ${UserDiff} + ${NiceDiff} + ${SystemDiff} + ${IdleDiff} + ${IOWaitDiff} + ${IrqDiff} + ${SoftIrqDiff} ))
	CPULoad=$(( ( ${Total} - ${IdleDiff} ) * 100 / ${Total} ))
	UserLoad=$(( ${UserDiff} *100 / ${Total} ))
	SystemLoad=$(( ${SystemDiff} *100 / ${Total} ))
	NiceLoad=$(( ${NiceDiff} *100 / ${Total} ))
	IOWaitLoad=$(( ${IOWaitDiff} *100 / ${Total} ))
	IrqCombinedLoad=$(( ( ${IrqDiff} + ${SoftIrqDiff} ) *100 / ${Total} ))
	
	echo "${CPULoad} ${SystemLoad} ${UserLoad} ${NiceLoad} ${IOWaitLoad} ${IrqCombinedLoad}" >/tmp/cpustat

	LastUserStat=${UserStat}
	LastNiceStat=${NiceStat}
	LastSystemStat=${SystemStat}
	LastIdleStat=${IdleStat}
	LastIOWaitStat=${IOWaitStat}
	LastIrqStat=${IrqStat}
	LastSoftIrqStat=${SoftIrqStat}
} # ProcessStats

GetExternalTemp() {
	# function that parses meteo.physik.uni-muenchen.de and mingaweda.de
	# temperature values for Munich and compares them. When values are out
	# of bounds then only the other value will be returned otherwise the average
	ExternalTemp1=$(/usr/bin/links -http.fake-user-agent 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12' -dump "http://www.meteo.physik.uni-muenchen.de/dokuwiki/doku.php?id=wetter:stadt:messung" | awk -F" " '/Lufttemperatur/ {printf ("%0.0f",$4*1000); }')
	ExternalTemp2=$(/usr/bin/links -http.fake-user-agent 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12' -dump "http://www.mingaweda.de/wetterdaten/" | awk -F" " '/Ausfu:hrliche/ {printf ("%0.0f",$2*1000); }')
	
	if [ "X${ExternalTemp2}" = "X" ]; then
		ExternalTemp2=${ExternalTemp1}
	elif [ "X${ExternalTemp1}" = "X" ]; then
		ExternalTemp1=${ExternalTemp2}
    fi

	echo $(( ( ${ExternalTemp1} + ${ExternalTemp2} ) / 2 ))
} # GetExternalTemp

SanitizeValue() {
	# keep thermal values in the range of 0°C-100°C since sometimes the values are massively out 
	# of range and then your graphs suffer from this. If a second argument is supplied then create
	# an average value to smooth graphs (useful for PMU and SoC)
	if [[ ${1} -lt 0 ]]; then
		echo -n 0
	elif [[ ${1} -ge 100000 ]]; then
		echo -n ${1}
	else
		if [[ "X$2" = "X" ]]; then
			echo -n ${1}
		else
			echo -n $(( ( $1 + $2 * 5 ) / 6 ))
		fi
	fi
} # SanitizeValue

Main "$@"
