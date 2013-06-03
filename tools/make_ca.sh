#!/bin/bash
# Extracted from http://zepala.free.fr/?q=book/export/html/49
 
# We are deleting all that has been previously created
# since the data of the old CA ROOT will no more be valid
rm -Rf sslcert
 
# Create a new base directory
mkdir sslcert
chmod 700 sslcert
 
# Lets go inside the directory
cd sslcert
 
# We create the sub directories
mkdir certs private public db
chmod 700 certs private public db
 
# Creating the database
echo "000001" > db/serial
touch db/certindex.txt
 
# Creation of the CA ROOT key
openssl req -new -x509 -extensions v3_ca -keyout private/cakey.pem -days 3650 -out public/cacert.pem -config ../openssl.cnf
 
# Display the create CA ROOT key
openssl x509 -in public/cacert.pem -text
