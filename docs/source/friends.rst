Friends
=======

Add "friends" linking RPi-Monitor running on different platform together


Friends is a notion that comes in version 1.2. A friend is simply another computer running RPi-Monitor. Configuring friends will add a drop down list on the right of the top menu with a links to RPi-Monitor sitting on the other computer.


Friends menu is visible on the top right


In /etc/rpimonitord.conf.d/default.conf, each friend is identified by its and is described by the 2 following parameters:


Here is an example of configuration for 3 friends:


web.friends.1.name=Raspberry Pi web.friends.1.link=http://192.168.0.123/ web.friends.2.name=Shuttle web.friends.2.link=http://192.168.0.2/ web.friends.3.name=Laptop web.friends.3.link=http://192.168.0.38/


Add "friends" linking RPi-Monitor running on different platform together


Friends is a notion that comes in version 1.2. A friend is simply another computer running RPi-Monitor. Configuring friends will add a drop down list on the right of the top menu with a links to RPi-Monitor sitting on the other computer.


Friends menu is visible on the top right


In /etc/rpimonitord.conf.d/default.conf, each friend is identified by its and is described by the 2 following parameters:


Here is an example of configuration for 3 friends:

web.friends.1.name=Raspberry Pi 
web.friends.1.link=http://192.168.0.123/ 
web.friends.2.name=Shuttle 
web.friends.2.link=http://192.168.0.2/ 
web.friends.3.name=Laptop 
web.friends.3.link=http://192.168.0.38/


