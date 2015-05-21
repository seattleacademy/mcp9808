#!/bin/bash

#AddLineIfAbsent [file] [string]
function AddLineIfAbsent {

#gets the number 
Test=$(grep -c "^[^#]*$2" $1)

#if the line is absent
if [ "$Test" -eq "0" ] 
then
	echo "'$2' absent in $1. Adding."
	echo "$2" >> $1
	#if the line is present
else
	echo "'$2' present in $1. Doing nothing."
fi
}

#make sure the user runs as root
if [ "$EUID" -ne 0 ]
  then 
  echo "Rerun this script as root by typing sudo ./setup.sh"
  exit
fi

#add a few lines to /etc/modules
file="/etc/modules"
if [ -f "$file" ]
then
	AddLineIfAbsent $file 'i2c-bcm2708' 
	AddLineIfAbsent $file 'i2c-dev'
    # code if found
else
    # code if not found
    echo "$file not found. Doing nothing."
fi

file="/boot/config.txt"
if [ -f "$file" ]
then
	AddLineIfAbsent $file 'dtparam=i2c1=on'
	AddLineIfAbsent $file 'dtparam=i2c_arm=on'
else
	echo "$file not found. Doing nothing."
fi

file="/etc/modprobe.d/raspi-blacklist.conf"
if [ -f "$file" ]
then
	echo "Blacklist file found. Deleting contents."
	truncate -s 0 /etc/modprobe.d/raspi-blacklist.conf
else
	echo "Blacklist file not found. Doing nothing."
fi