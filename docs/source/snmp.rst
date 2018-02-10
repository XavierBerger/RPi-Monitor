SNMP configuration
==================

**SNMP daemon configuration**

  Section 'snmpagent' is defining SNMP behavior of rpimonitord.

  snmpagent.rootoid=.1.3.6.1.4.1
    Define root OID for snmp-agent (Default:.1.3.6.1.4.1)

  snmpagent.enterpriseoid=54321
    Define enterprise OID for snmp agent (Default:54321)

  snmpagent.rpimonitoroid=42
    Define rpimonitor OID for snmp agent (Default:42)

  snmpagent.mibname=RPIMONITOR-MIB
    Define MIB name (Default:RPIMONITOR-MIB)

  snmpagent.lastupdate=201802030000Z
    Define MIB last update field (Default:201802030000Z)

  snmpagent.moduleidentity=rpi-experiences
    Define MIB module identity (Default:rpi-experiences)

  snmpagent.organisation=RPi-Monitor
    Define MIB organisation (Default:RPi-Monitor)

  snmpagent.contactionfo=http://rpi-experiences.blogspot.fr/
    Define MIB contact info (Default:http://rpi-experiences.blogspot.fr/)

  snmpagent.description=description
    Define MIB description (Default:description)

  snmpagent.revision=201802030000Z
    Define MIB revision (Default:201802030000Z)



**SNMP OID configuration**

  RPi-Monitor is able to act as an snmp agent. Snmp configuration is based
  on KPI name. KPI could be static or dynamic.

  snmp.<kpi name>.id=<id>
    <id> is the last number of OID appended at the end of OID configuration
    defined for snmp agent. (ref. SNMP agent configuration section)

  snmp.<kpi name>.type=<type>
    Type of data can be : counter, counter64, gauge, integer, ipaddr,
      ipaddress, netaddr, objectid, octetstr, string, timeticks

  snmp.<kpi name>.description=<text description>
    Description of KPI to be added in MIB

  snmp.<kpi name>.postprocess=<formula>
    Post process formula to apply to KPI before sending over SNMP.
    Ex: Convert float to interger by mutiplying by 100: $1*100

  Commands to use to get MIB information:
    Snmp Configuration
      See configuration file example in /etc/snmp/snmpd.conf.rpimonitor
      and activate pass_persist extension
    Extract MIB from RPi-Monitor
      rpimonitord -m > ~/mib.txt
    Get data from SNMP
      snmpwalk -v 2c -m ~/mib.txt -c public 127.0.0.1 1.3.6.1.4.1.54321.42