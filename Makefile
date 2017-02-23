TARGETDIR?=/
STARTUPSYS?=sysVinit

all:
	@echo "Makefile usage"
	@echo ""
	@echo " Configuration is done using environment variable"
	@echo ""
	@echo " TARGETDIR defines where to install RPi-Monitor"
	@echo " STARTUPSYS defines the startup system to install. Possible values are:"
	@echo "  - sysVinit"
	@echo "  - upstart"
	@echo "  - systemd"
	@echo ""
	@echo " The current values are:"
	@echo "  TARGETDIR=${TARGETDIR}"
	@echo "  STARTUPSYS=${STARTUPSYS}"
	@echo ""
	@echo " Once environment variable are set, execute: make install"
	@echo ""

install:
	@echo "Installing RPi-Monitor in ${TARGETDIR}"
	@mkdir -p ${TARGETDIR}var/lib/rpimonitor
	@cp -a src/var/lib/rpimonitor/* ${TARGETDIR}var/lib/rpimonitor/
	@mkdir -p ${TARGETDIR}etc/rpimonitor
	@cp -a src/etc/rpimonitor/* ${TARGETDIR}etc/rpimonitor/
	@mkdir -p ${TARGETDIR}etc/cron.d
	@cp -a src/etc/cron.d/* ${TARGETDIR}etc/cron.d/
	@mkdir -p ${TARGETDIR}usr/bin
	@cp -a src/usr/bin/* ${TARGETDIR}usr/bin/
	@mkdir -p ${TARGETDIR}usr/share/rpimonitor
	@cp -a src/usr/share/rpimonitor/* ${TARGETDIR}usr/share/rpimonitor/
	@echo "Startup system is ${STARTUPSYS}"
ifeq (${STARTUPSYS},sysVinit)
	@mkdir -p ${TARGETDIR}etc/init.d
	@cp -a src/etc/init.d/* ${TARGETDIR}etc/init.d/
endif
ifeq (${STARTUPSYS},upstart)
	@mkdir -p ${TARGETDIR}etc/init
	@cp -a src/etc/init/* ${TARGETDIR}etc/init/
endif
ifeq (${STARTUPSYS},systemd)
	@mkdir -p ${TARGETDIR}usr/lib/systemd/system
	@cp -a src/usr/lib/systemd/system/* ${TARGETDIR}etc/systemd/system/
endif
	@echo "Installation completed"
