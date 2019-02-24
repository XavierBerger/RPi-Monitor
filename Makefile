TARGETDIR?=/
STARTUPSYS?=systemd
INSTALLMAN?=False
INSTALLSNMP?=False
INSTALLSCRIPTS?=False
INSTALLEXAMPLE?=False
INSTALLTEMPLATE?=False

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
	@echo " INSTALLxxx defines if related feature should ne installed or not"
	@echo ""
	@echo " The current values are:"
	@echo "  TARGETDIR=${TARGETDIR}"
	@echo "  STARTUPSYS=${STARTUPSYS}"
	@echo "  INSTALLMAN=${INSTALLMAN}"
	@echo "  INSTALLSNMP=${INSTALLSNMP}"
	@echo "  INSTALLSCRIPTS=${INSTALLSCRIPTS}"
	@echo "  INSTALLEXAMPLE=${INSTALLEXAMPLE}"
	@echo "  INSTALLTEMPLATE=${INSTALLTEMPLATE}"
	@echo ""
	@echo " Once environment variable are set, execute: make install"
	@echo ""

DOCS_DIR = docs
.PHONY: man
man:
ifeq (True,${INSTALLMAN})
	@make -C $(DOCS_DIR) man
endif

install: man
	@echo "Installing RPi-Monitor in ${TARGETDIR}"
	
	@mkdir -p ${TARGETDIR}usr/bin
	@cp -r src/usr/bin/rpimonitord ${TARGETDIR}usr/bin/
	
	@mkdir -p ${TARGETDIR}/usr/share/rpimonitor/web
	@cp -r src/usr/share/rpimonitor/web/* ${TARGETDIR}/usr/share/rpimonitor/web/

	@mkdir -p ${TARGETDIR}etc/rpimonitor.d
	@cp -r src/etc/rpimonitor.conf ${TARGETDIR}etc/
	@cp src/etc/rpimonitor.d/??_* ${TARGETDIR}etc/rpimonitor.d/
	
ifeq (True,${INSTALLSNMP})	
	@cp -r src/usr/bin/rpimonitord-snmp ${TARGETDIR}usr/bin/
	@mkdir -p ${TARGETDIR}etc/snmp
	@cp -r src/etc/snmp/* ${TARGETDIR}etc/snmp/
endif

ifeq (True,${INSTALLCRON})	
	@mkdir -p ${TARGETDIR}etc/cron.d
	@cp -r src/etc/cron.d/* ${TARGETDIR}etc/cron.d/
endif
ifeq (True,${INSTALLMAN})
	@mkdir -p ${TARGETDIR}usr/share/man/man1
	@cp -r docs/build/man/rpimonitor.1 ${TARGETDIR}usr/share/man/man1/
	@mkdir -p ${TARGETDIR}usr/share/man/man5
	@cp -r docs/build/man/rpimonitor-*.conf.5 ${TARGETDIR}usr/share/man/man5/
endif
ifeq (True,${INSTALLSCRIPTS})
	@mkdir -p ${TARGETDIR}/usr/share/rpimonitor/scripts
	@cp src/usr/share/rpimonitor/scripts/* ${TARGETDIR}/usr/share/rpimonitor/scripts/
	@mkdir -p ${TARGETDIR}var/lib/rpimonitor
	@cp -r src/var/lib/rpimonitor/* ${TARGETDIR}var/lib/rpimonitor/
ifeq (${STARTUPSYS},systemd)
	@mkdir -p ${TARGETDIR}/lib/systemd/system
	@cp -r src/lib/systemd/system/rpimonitord-upgradable* ${TARGETDIR}/lib/systemd/system/
endif
endif

ifeq (True,${INSTALLEXAMPLE})
	@mkdir -p ${TARGETDIR}/etc/rpimonitor.d/example
	@cp src/etc/rpimonitor.d/example/* ${TARGETDIR}/etc/rpimonitor.d/example/
endif

ifeq (True,${INSTALLTEMPLATE})
	@mkdir -p ${TARGETDIR}/etc/rpimonitor.d/template
	@cp src//etc/rpimonitor.d/template/* ${TARGETDIR}/etc/rpimonitor.d/template/
ifeq (${STARTUPSYS},systemd)
	@mkdir -p ${TARGETDIR}/lib/systemd/system
	@cp -r src/lib/systemd/system/sunxi-temp-daemon.service ${TARGETDIR}/lib/systemd/system/
endif
endif

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
	@cp -r src/lib/systemd/system/rpimonitord.service ${TARGETDIR}/lib/systemd/system/
endif
	@echo "Installation completed"

clean:
	@echo
