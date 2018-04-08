<p align="center"><img src="https://cloudypro.com/wp-content/uploads/2015/05/cpanel-logo-300x108.png"></img></p>


##### 1. Navigate to cPanel -> Select PHP Version
##### 2. Open Console (F12 / Right Click -> Inspect -> Console)
##### 3. Copy / Paste <a href="https://github.com/i-den/utilities/blob/master/JavaScript/selectorGrabber.js">Selector Grabber</a> 
##### 4. Select PHP Version from the Dropdown for each Version that will be Installed

###### 4.1 Adding PHP Extension for Installation on the VPS
```javascript
grabber.add54()
grabber.addCustom(54)

add55() -- add56() -- add70() -- add71() -- add72()
addCustom(55) -- addCustom(56) -- addCustom(70) -- addCustom(71) -- addCustom(72)
```

###### 4.2 Removing PHP Extensions that were added by mistake
```javascript
grabber.rm54()
grabber.rmCustom(54)

rm55() -- rm56() -- rm70() -- rm71() -- rm72()
rmCustom(55) -- rmCustom(56) -- rmCustom(70) -- rmCustom(71) -- rmCustom(72)
```
