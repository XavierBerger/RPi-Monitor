#!/bin/bash

if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root"
  exit 1
fi

echo -n "Enter new username: "; read user
echo -n "Enter new password: "; read pass

printf "$user:$(openssl passwd -crypt $pass)\n" >> /etc/nginx/.htpasswd
