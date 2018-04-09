<p align="center"><img src="https://cloudypro.com/wp-content/uploads/2015/05/cpanel-logo-300x108.png"></img></p>


##### 1. Navigate to cPanel -> Select PHP Version
<img src="https://camo.githubusercontent.com/9509b9726f804458c90e52ffa926fd2c975b6d18/68747470733a2f2f692e696d6775722e636f6d2f614142426f364f2e706e67">

##### 2. Open Console (F12 / Right Click -> Inspect -> Console)
<img src="https://camo.githubusercontent.com/2d0f09a0f9d02b5317c8e7f0710de56f92b94ebe/68747470733a2f2f692e696d6775722e636f6d2f6b4c445936764d2e706e67">

##### 3. Copy / Paste <a href="https://raw.githubusercontent.com/i-den/utilities/master/JavaScript/selectorGrabber.js">Selector Grabber</a>
<img src="https://camo.githubusercontent.com/5a4d24f05495a8c0eb0de6c0afcf9936f5d0b34b/68747470733a2f2f692e696d6775722e636f6d2f706535696544332e706e67">

##### 4. Select PHP Version from the Dropdown for each Version that will be Installed

###### 4.1 Adding PHP Extension for Installation on the VPS
```javascript
grabber.add54()
grabber.addCustom(54)

add55() -- add56() -- add70() -- add71() -- add72()
addCustom(55) -- addCustom(56) -- addCustom(70) -- addCustom(71) -- addCustom(72)
```
<img src="https://camo.githubusercontent.com/096c2ae96088c96d0fd29a00cdc4bd64deffc66e/68747470733a2f2f692e696d6775722e636f6d2f453668386948622e706e67">

###### 4.2 Removing PHP Extensions that were added by mistake
```javascript
grabber.rm54()
grabber.rmCustom(54)

rm55() -- rm56() -- rm70() -- rm71() -- rm72()
rmCustom(55) -- rmCustom(56) -- rmCustom(70) -- rmCustom(71) -- rmCustom(72)
```

###### 4.3 Clear PHP Extensions
```javascript
grabber.clear()
```

###### 4.4 Report PHP Versions
```javascript
grabber.v()
```

###### 4.5 When Ready - Get JSON
```javascript
grabber.getJSON() // !! WITHOUT " AT START AND END !!
```
<img src="https://camo.githubusercontent.com/8d6e2e6fb83a4091bbd1b835b1a6af5bb33ef880/68747470733a2f2f692e696d6775722e636f6d2f79574b7a3962752e706e67"></img>


##### 5. Login to VPS

##### 6. WHM -> EasyApache4 -> Customize -> PHP Extensions

##### 7. Select Each PHP Version and All from the Dropdown
<img src="https://camo.githubusercontent.com/07cf9fbf31efbb537f109df7f6e5b4f652f87966/68747470733a2f2f692e696d6775722e636f6d2f4378376f5246792e706e67">

##### 8. Open Console (F12 / Right Click -> Inspect -> Console)

##### 9. Copy / Paste <a href="https://raw.githubusercontent.com/i-den/utilities/master/JavaScript/extInstaller.js">Extension Installer</a>

###### 9.1 The `` Are MANDATORY. Replace the JSON_GOES_HERE with the JSON from 
```javascript
installer.install(`JSON_GOES_HERE`)
```

<img src="https://camo.githubusercontent.com/b49f8d176ed61dec0ade2ef681c71a10710dbd05/68747470733a2f2f692e696d6775722e636f6d2f633769506a4d762e706e67">

##### 10. Fix Additional Dependencies:

* ffmpeg:
  * via yum
* magickwand
  * yum install ImageMagick-devel
* imagick
  * yum install ImageMagick-devel
  * WHM -> Module Installers -> PHP Pecl [Manage] -> imagick
* ioncube_loader
  * WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube
* opcache
  * NO opcache for PHP 5.4
* phalcon
  * NO phalcon for PHP 5.4 and 7.2
* recode
  * Incompatible with imap, fix dependencies manually
