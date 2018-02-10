Customise menu logo, title and page title
=========================================

This new function allow to define a custom logo, custome title and add the hostname of the machine int the title of the browser.

Here are the configuration lines used by default:

  web.page.icon='img/avatar.png'
  web.page.menutitle='XB-Monitor  <sub>('+data.hostname+')</sub>'
  web.page.pagetitle='XB-Monitor ('+data.hostname+')'

data.hostname is a value automatically extracted by RPi-Monitor. It is not needed to add a configuration to do such a thing.

The file avatar.png has been added into /usr/share/rpimonitor/web/img/.

Here is the result:



Inside Firefox title bar and tab, the title has been changed and hostmane has been added between parentheses.
Inside RPi-Monitor menu bar, le logo and the title have been changed and hostmane has been added between parentheses. 