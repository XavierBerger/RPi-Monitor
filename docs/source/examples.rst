Example files
=============

RPi-Monitor comes with example files showing the capabilities of some features and functions available in status page. To see how a specific file is behaving, you can include this file into your configuration file using the 'include' directive. Files are included  and commented out into raspbian.conf. To activate them, you can simply uncomment them.  
The following files are available:

    example.badge_and_label.conf : Show colors of labels and badg

 

    example.progressbar.conf : Show warning and critical and colors 



    example.justgage.conf : Show justgage and customisation





    example.visibility.conf : Show visibility feature

 
Remember to restart RPi-Monitor to apply the configuration change:

  sudo /etc/init.d/rpimonitor restart

New: Bootstrap 3

Now, RPi-Monitor is using the popular framewrok bootstrap 3. This change fix the bug of menu when using RPi-Monitor in tablet or smartphone.

This change also have sides effects on the Label and Badge. If you had customized your installation or RPi-Monitor, you should read with attention the man page related to these feature. A configuration file is also available, example.badge_and_label.conf, show how label and badges are now displayed.

New: JustGageBar

A new widget is now available to display information in status page. Justgage is a handy JavaScript plugin for generating and animating nice & clean gauges. It is based on Raphaël library for vector drawing, so it’s completely resolution independent and self-adjusting.

  JustGageBar(title, label,min, value, max, width, height, levelColors, warning, critical)
 
To see how justgage behave, you can activate the configuration file example.justgage.conf (Ref example explaination and screenshot upper).

The detail of function usage is available into the manpage:


  man rpimonitord.conf

New: Visibility

A new parameter can be used in configuration file defining a visibility of a row:

  web.status.<page id>.content.<row id>.visibility=<visibility formula>

<visibility formula> should be a valid javascript formula returning
          0: to hide the row
          anything else but 0: show the row
