#!/bin/bash
# Extracted from http://zepala.free.fr/?q=book/export/html/49
 
if [ -z "$1" ]
then
  echo ""
  echo "Usage :"
  echo ""
  echo "  $0 \"name_of_certificat\""
  echo ""
  exit 0
fi
 
echo ""
echo "Select certificat type:"
echo ""
echo "  1) Server Certificat"
echo "  2) Client Certificat (Default)"
echo ""
echo -n "Your choice : "
read CERT
 
if [ "${CERT}" != "1" ]; then
  CERT="2"
fi
 
echo "Creating certificat $1.pem"
 
# We go into the subdirectory
cd sslcert
 
# Creating key and signature request
echo ""
echo -n "**** Creating "
if [ "${CERT}" == "1" ]; then
  echo -n "server "
fi
echo " key and signature request"
openssl req -new -nodes -out public/$1-req.pem -keyout private/$1-key.pem -config ../openssl.cnf
 
# Signing key
echo ""
echo "**** Signing key"
if [ "${CERT}" == "1" ]; then
  openssl ca -out public/$1-cert.pem -extensions server -config ../openssl.cnf -infiles public/$1-req.pem
fi
if [ "${CERT}" == "2" ]; then
  openssl ca -out public/$1-cert.pem -extensions v3_req -config ../openssl.cnf -infiles public/$1-req.pem
fi

echo "**** Exporting kay"
openssl pkcs12 -export -in public/$1-cert.pem -inkey private/$1-key.pem -out public/$1-bundle.p12
 
echo ""
echo "**** Show created"
# Affichage de la clé
openssl x509 -in public/$1-cert.pem -text
