
install:
	mkdir -p /var/lib/rpimonitor
	cp -a src/var/lib/rpimonitor/* /var/lib/rpimonitor/

	mkdir -p /etc/rpimonitor
	cp -a src/etc/rpimonitor/* /etc/rpimonitor/

	mkdir -p /etc/init.d
	cp -a src/etc/init.d/* /etc/init.d/

	mkdir -p /etc/cron.d
	cp -a src/etc/cron.d/* /etc/cron.d/

	mkdir -p /usr/bin
	cp -a src/usr/bin/* /usr/bin/

	mkdir -p /usr/share/rpimonitor
	cp -a src/usr/share/rpimonitor/* /usr/share/rpimonitor/
