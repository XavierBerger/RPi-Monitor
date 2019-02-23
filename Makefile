TARGETDIR?=/
STARTUPSYS?=systemd
NODOCS?=False

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
	@echo " NODOCS define is manpage should be skipped"
	@echo ""
	@echo " The current values are:"
	@echo "  TARGETDIR=${TARGETDIR}"
	@echo "  STARTUPSYS=${STARTUPSYS}"
	@echo "  NODOCS=${NODOCS}"
	@echo ""
	@echo " Once environment variable are set, execute: make install"
	@echo ""

DOCS_DIR = docs
.PHONY: man
man:
ifeq (False,${NODOCS})
	@make -C $(DOCS_DIR) man
	@mkdir -p ${TARGETDIR}usr/share/man/man1
	@cp -r docs/build/man/rpimonitor.1 ${TARGETDIR}usr/share/man/man1/
	@mkdir -p ${TARGETDIR}usr/share/man/man5
	@cp -r docs/build/man/rpimonitor-*.conf.5 ${TARGETDIR}usr/share/man/man5/
endif

install: man
	@echo "Installing RPi-Monitor in ${TARGETDIR}"
	@mkdir -p ${TARGETDIR}var/lib/rpimonitor
	@cp -r src/var/lib/rpimonitor/* ${TARGETDIR}var/lib/rpimonitor/
	@mkdir -p ${TARGETDIR}etc/rpimonitor
	@cp -r src/etc/rpimonitor/* ${TARGETDIR}etc/rpimonitor/
	@mkdir -p ${TARGETDIR}etc/cron.d
	@cp -r src/etc/cron.d/* ${TARGETDIR}etc/cron.d/
	@mkdir -p ${TARGETDIR}etc/snmp
	@cp -r src/etc/snmp/* ${TARGETDIR}etc/snmp/
	@mkdir -p ${TARGETDIR}usr/bin
	@cp -r src/usr/bin/* ${TARGETDIR}usr/bin/
	@mkdir -p ${TARGETDIR}usr/share/rpimonitor
	@cp -r src/usr/share/rpimonitor/* ${TARGETDIR}usr/share/rpimonitor/
	@echo "Startup system is ${STARTUPSYS}"
	
ifeq (${STARTUPSYS},sysVinit)
	@mkdir -p ${TARGETDIR}etc/init.d
	@cp -r src/etc/init.d/* ${TARGETDIR}etc/init.d/
endif
ifeq (${STARTUPSYS},upstart)
	@mkdir -p ${TARGETDIR}etc/init
	@cp -r src/etc/init/* ${TARGETDIR}etc/init/
endif
ifeq (${STARTUPSYS},systemd)
	@mkdir -p ${TARGETDIR}/lib/systemd/system
	@cp -r src/lib/systemd/system/* ${TARGETDIR}/lib/systemd/system/
endif
	@echo "Installation completed"

clean:
	@echo
