<h1 style="font-weight:normal">
  &nbsp;node-red-contrib-wago&nbsp;
  <a href="kbus-daemon gif"><img src=images/kbus-daemon.gif></a>
</h1>

A set of nodes to control open source MQTT IO Module API on WAGO Llinux PFC Controllers.
<br>

Features
========
* Nodes connect directly to MQTT broker either onboard the controller or externally
* Status and error messages are caught by the kbus reader
* Integrated scaling for analog input signals and process scaling for analog outputs
* New cyclic oprtation to prevent stagnant data
* Very low CPU resource usage

Get started
===========
You must install the driver on your controller.  The installer can be found here [pfc-kbus-api](https://github.com/jessejamescox/pfc-kbus-api), take care to update the kbus-api.conf file on the controller as this determines the broker and behavior of the kbus-api.

Default MQTT Broker is 127.0.0.1 and NodeID is "PFC200" unless changed in configuration file.  

Requirements
============
* WAGO PFC with Docker engine running the [Open Source Kbus API](https://github.com/jessejamescox/pfc-kbus-api)

License
=======
@wago/node-red-io-api is under the MIT license. See the [LICENSE](https://github.com/jessejamescox/node-red-contrib-kbus/blob/main/LICENSE.md) for more information.

Links
=====
* [Jesse Cox YouTube](https://www.youtube.com/channel/UCXEwdiyGgzVDJD48f7rWOAw)
* [Jesse Cox LinkedIn](https://www.linkedin.com/in/jesse-cox-90535110/)
