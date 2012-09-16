# zwave.js

A comprehensive stack for managing a home Z-Wave network, written in node.js JavaScript,  based loosely on the [Open Z-Wave project](http://code.google.com/p/open-zwave/).

## Project goals

* A low-level driver to interact with a USB dongle Z-Wave controller.  Systems based on the Zensys serial API should work with this sytem.

* A service frontend for interaction with web clients, to be based on the Express node.js
module.

* A client interface with a highly-dynamic, non-modal interaction with the service
front-end.

## Status

### What works

* The entire init sequence completes successfully for the driver.

* Available nodes are determined.

### What is next

* Lots of low-level work:
    * Determine capabilities of each available node.
    * Naturally, allow for control and feedback of individual node settings, starting with simple light controllers.
    * Persistently cache data related to the node network so it doesn't all necessarily need to be determined at every launch.
    
### What will eventually be really cool

* "Plugin" support to allow custom programming.  E.g., create a plugin that will turn
on a group of lights if a particular light is activated.

* A scalable interface that will work well from any web browser, especially mobile devices.

### What is not in scope

* HID-based USB dongles.  I'm not working on anything currently that doesn't use the
virtual COM port interfaces.  In truth, I'm only working on the Aeon Labs Z-Stick 2 controller.

* A focus on platforms beside Mac OS X.  Theoretically, using vanilla node.js, 
portable node.js modules, and web browsers for UI, this system will work on other OSs, but I'm not spending any effort on that right now.





