#!/bin/bash
#
# SoC/HDD temperature daemon. Writes the current temperatures to
# /run/soc-temp and /run/hdd-temp (since we're experiencing always
# timeouts under heavy load when trying to get the temperatures
# directly from within RPi-Monitor.

Main() {
        # SoCTempAdjustment is needed because the A20 SoC delivers uncalibrated temp values
        SoCTempAdjustment=1447

        # ensure module sunxi-dbgreg.ko is loaded
        grep -q sunxi_dbgreg </proc/modules || ( modprobe sunxi-dbgreg ; sleep 0.1 )

        # prepare registers
        echo 'f1c25000:27003f' > /sys/devices/virtual/misc/sunxi-dbgreg/rw/write;
        echo 'f1c25010:40000' > /sys/devices/virtual/misc/sunxi-dbgreg/rw/write;
        echo 'f1c25018:10fff' > /sys/devices/virtual/misc/sunxi-dbgreg/rw/write;
        echo 'f1c25004:10' > /sys/devices/virtual/misc/sunxi-dbgreg/rw/write;

        while [ 2 -ge 1 ]; do
                # let the value be written to syslog
                echo 'f1c25020' > /sys/devices/virtual/misc/sunxi-dbgreg/rw/read;

                # wait 0.1 seconds
                sleep 0.1

                # read return value from syslog and transform it into degrees Celsius
                HexVal=$(tail /var/log/syslog | awk -F" 0x" '/ 0x/ {print $2}' | tail -n1 )
                SoCTemp=$(echo $(( 0x${HexVal} - ${SoCTempAdjustment} )) | awk '{printf ("%0.1f",$1/10); }')
                if [ "X${SoCTemp}" != "X" ]; then
                        echo -n ${SoCTemp} >/run/soc-temp
                fi

                # HDD/SSD temp
                DiskTemp=$(hddtemp -n /dev/sda)
                if [ "X${DiskTemp}" != "X" ]; then
                        echo -n ${DiskTemp} >/run/hdd-temp
                fi

                # sleep 5 secs
                sleep 5
        done
} # Main

Main