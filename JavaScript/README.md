<p align="center"><img src="https://cloudypro.com/wp-content/uploads/2015/05/cpanel-logo-300x108.png"></img></p>


##### 1. Navigate to cPanel -> Select PHP Version
##### 2. Open Console (F12 / Right Click -> Inspect -> Console)
##### 3. Copy / Paste <a href="https://github.com/i-den/utilities/blob/master/JavaScript/selectorGrabber.js">Selector Grabber</a> 
##### 4. Select PHP Version from the Dropdown for each Version that will be Installed

```javascript
// Each Version
grabber.add54() // Adds PHP 5.4 Extensions to JSON
add55() -- add56() -- add70() -- add71() -- add72()

// Type Version
grabber.addCustom(54) // Adds PHP 5.4 Extensions to JSON
addCustom(55) -- addCustom(56) -- addCustom(70) -- addCustom(71) -- addCustom(72)

// Remove Version
grabber.rm54() // Remove PHP 5.4 Extensions from JSON
rm55() -- rm56() -- rm70() -- rm71() -- rm72()
```

