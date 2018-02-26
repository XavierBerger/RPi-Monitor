#!/bin/bash

# Add legend in png image with the following command:
#  convert image.png -set 'Doc Width' '500px' -set 'Doc Description' 'Status page' image.png
TARGET=02_screenshots.rst


cd source
echo ":github_url: https://github.com/XavierBerger/RPi-Monitor/blob/feature/docs/docs/source/${TARGET}" > ${TARGET}
echo "Screenshots" >> ${TARGET}
echo "===========" >> ${TARGET}

for IMAGE in $(ls _static/*.png)
do
    DESCRIPTION=$(exiftool ${IMAGE} | perl -ne '/Doc Description\s+:\s+(.*)/ and print $1' )
    if [ "" != "${DESCRIPTION}" ]
    then
        WIDTH=$(exiftool ${IMAGE} | perl -ne '/Doc Width\s+:\s+(.*)/ and print $1' )
        echo "-----" >> ${TARGET}
        echo >> ${TARGET}
        echo ".. figure:: ${IMAGE}" >> ${TARGET}
        echo "   :align: center" >> ${TARGET}
        if [ "" !=  "${WIDTH}" ]
        then 
            echo "   :width: ${WIDTH}" >> ${TARGET}
        fi 
        echo >> ${TARGET}
        echo "   ${DESCRIPTION}" >> ${TARGET}
        echo >> ${TARGET}
    fi
done