<p align="center"><img src="https://cloudypro.com/wp-content/uploads/2015/05/cpanel-logo-300x108.png"></img></p>


##### 1. Navigate to cPanel -> Select PHP Version
##### 2. Open Console (F12 / Right Click -> Inspect -> Console)
##### 3. Copy / Paste <a href="https://github.com/i-den/utilities/blob/master/JavaScript/selectorGrabber.js">Selector Grabber</a> 
##### 4. Select PHP Version from the Dropdown for each Version that will be Installed

```javascript
// Each Version
grabber.add54() // Adds PHP 5.4 Extensions
grabber.add55() -- grabber.add56() -- grabber.add70() -- grabber.add71() -- grabber.add72()

// Type Version
grabber.addCustom(54) // Adds PHP 5.4 Extensions
grabber.addCustom(55) -- grabber.addCustom(56) -- grabber.addCustom(70) -- grabber.addCustom(71) -- grabber.addCustom(72)
```

