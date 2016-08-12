TARGET?=/

install:
	@echo "Installing RPi-Monitor in ${TARGET}"
	@mkdir -p ${TARGET}var/lib/rpimonitor
	@cp -a src/var/lib/rpimonitor/* ${TARGET}var/lib/rpimonitor/
	@mkdir -p ${TARGET}etc/rpimonitor
	@cp -a src/etc/rpimonitor/* ${TARGET}etc/rpimonitor/
	@mkdir -p ${TARGET}etc/init.d
	@cp -a src/etc/init.d/* ${TARGET}etc/init.d/
	@mkdir -p ${TARGET}etc/cron.d
	@cp -a src/etc/cron.d/* ${TARGET}etc/cron.d/
	@mkdir -p ${TARGET}usr/bin
	@cp -a src/usr/bin/* ${TARGET}usr/bin/
	@mkdir -p ${TARGET}usr/share/rpimonitor
	@cp -a src/usr/share/rpimonitor/* ${TARGET}usr/share/rpimonitor/
	@echo "Installation completed"
