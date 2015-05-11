#!/bin/bash

if [ "$EUID" -ne 0 ]
  then 
  echo "Rerun this script as root by typing sudo ./setup.sh"
  exit
fi

echo "Updating /etc/modules"
echo 'i2c-bcm2708' >> /etc/modules
echo 'i2c-dev' >> /etc/modules

file="/boot/config.txt"
if [ -f "$file" ]
then
	echo "Updating /boot/config.txt"
	echo 'dtparam=i2c1=on' >> /boot/config.txt
	echo 'dtparam=i2c_arm=on' >> /boot/config.txt
else
	echo "Config.txt file not found. Doing nothing."
fi

blacklist="/etc/modprobe.d/raspi-blacklist.conf"
if [ -f "$blacklist" ]
then
	echo "Blacklist file found. Deleting contents."
	truncate -s 0 /etc/modprobe.d/raspi-blacklist.conf
else
	echo "Blacklist file not found. Doing nothing."
fi