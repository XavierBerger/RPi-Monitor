#!/bin/bash

# Source function library.
. /lib/lsb/init-functions

# Update file /var/lib/rpimonitor/updatestatus.txt
log_daemon_msg "RPi-Monitor" "Updating package status"
LANG=C
apt-get upgrade --dry-run| perl -ne '/(.*upgraded.*installed|^  \S+.*)/ and print "$1 "' 2>/dev/null > /var/lib/rpimonitor/updatestatus.txt
status=$?
log_end_msg $status
