#!/bin/bash
##
##This script return the bandwidth in Rx and Tx by substract old Rx/Tx values by the new ones.
##Ex: If the script is called every 10s, it will compare the rx_bytes 10s ago (old_rx) with the new one (rx) and substract these two values to get a value as Bytes/10S
##
## Author : TDUVAL
 
# Location of the networkTraffic files
LOCATION="/usr/share/rpimonitor/web/custom/net_traffic/"
 
# Test if directory $path exist then create it
if [ ! -d $LOCATION ]
then    mkdir $LOCATION
fi
 
# Test if file rx exist then create it
if [ ! -f $LOCATION/rx ]
then    touch $LOCATION/rx
fi
 
# Test if file tx exist then create it
if [ ! -f $LOCATION/tx ]
then    touch $LOCATION/tx
fi
 
# Get old values in rx/tx files
OLDRX=`cat $LOCATION/rx`
OLDTX=`cat $LOCATION/tx`
 
# Get new values
RX=`cat /sys/class/net/eth0/statistics/rx_bytes`
TX=`cat /sys/class/net/eth0/statistics/tx_bytes`
 
# Store new values in rx/tx files
echo $RX > $LOCATION/rx
echo $TX > $LOCATION/tx
 
# Substract new - old to get traffic in Bytes/period
RX_TRAFFIC=$(($RX-$OLDRX))
TX_TRAFFIC=$(($TX-$OLDTX))
 
# Display traffic value in stdout
echo -e "rx=$RX_TRAFFIC\ntx=$TX_TRAFFIC"
