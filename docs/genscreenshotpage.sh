#!/bin/bash

# Add legend in png image with the following command:
#  convert image.png -set 'Doc Width' '500px' -set 'Doc Description' 'Status page' image.png

cd source
echo "Screenshots"
echo "==========="

for IMAGE in $(ls _static/*.png)
do
    DESCRIPTION=$(exiftool ${IMAGE} | perl -ne '/Doc Description\s+:\s+(.*)/ and print $1' )
    if [ "" != "${DESCRIPTION}" ]
    then
        WIDTH=$(exiftool ${IMAGE} | perl -ne '/Doc Width\s+:\s+(.*)/ and print $1' )
        echo "-----"
        echo
        echo ".. figure:: ${IMAGE}"
        echo "   :align: center"
        if [ "" !=  "${WIDTH}" ]
        then 
            echo "   :width: ${WIDTH}"
        fi 
        echo
        echo "   ${DESCRIPTION}"
        echo
    fi
done