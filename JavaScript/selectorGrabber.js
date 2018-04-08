/**
 *     __        __   _       _   _           _     _____
 *     \ \      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___
 *      \ \ /\ / / _ \ '_ \  | |_| |/ _ \/ __| __| | |_ / _` |/ __/ _ \
 *       \ V  V /  __/ |_) | |  _  | (_) \__ \ |_  |  _| (_| | (_|  __/
 *        \_/\_/ \___|_.__/  |_| |_|\___/|___/\__| |_|  \__,_|\___\___|
 *
 *                     PHP Extension Grabber v1.5
 */

var grabber = (function defineGrabber() {
    "use strict";

    var allPHPExtensions = [],
        availablePhpVersions = [],
        _logger,
        _finder,
        _auth,
        api;

    _logger = (function defineLogger() {
        var style = "background: #444853; border-radius: 2px; line-height: 18px;";

        function logError(msg) {
            console.log(`%c   ${msg}    `, style + "color: red;");
        }

        function logInfo(msg) {
            console.log(`%c ${msg} `, style + "color: #8daed6;");
        }

        function logStoredVersionExts() {
            var css = [],
                msgs = [];

            allPHPExtensions.forEach(function addPHPVersToConsole(phpVerObj) {
                msgs.push(`%c ${phpVerObj.version} `);
                css.push(style + "color: #b6d580; margin: 2px;");
            });

            console.log("%c   PHP Versions    ", style + "color: #b6d580");
            console.log(msgs.sort().join(""), ...css);
        }

        function help() {
            {
                let $_$ = ` __        __   _       _   _           _     _____              
 \\ \\      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___ 
  \\ \\ /\\ / / _ \\ '_ \\  | |_| |/ _ \\/ __| __| | |_ / _\` |/ __/ _ \\
   \\ V  V /  __/ |_) | |  _  | (_) \\__ \\ |_  |  _| (_| | (_|  __/
    \\_/\\_/ \\___|_.__/  |_| |_|\\___/|___/\\__| |_|  \\__,_|\\___\\___|
                                                                 
                    PHP Extension Grabber v1.5`;

                console.log($_$);
            }
            console.log("%c \\-- Select PHP Version from the Top Left dropdown, then ", style + "color: #8daed6;");
            console.log("  |-- grabber.add54() - %c All Extensions for PHP 5.4 are added to a JSON", "color: green;");
            console.log("  |-- grabber.add55() --  grabber.add56() --  grabber.add70() --  grabber.add71() --  grabber.add72()");

            console.log("%c \\-- This will remove all stored PHP Extensions for a version that were stored in the JSON ", style + "color: #8daed6;");
            console.log("  |-- grabber.rm54() - %c All Extensions for PHP 5.4 are removed from the JSON", "color: green;");
            console.log("  |-- grabber.rm55() --  grabber.rm56() --  grabber.rm70() --  grabber.rm71() --  grabber.rm72()");

            console.log("%c \\-- Utilities  ", style + "color: #8daed6;");
            console.log("  |-- grabber.v() - %c List all PHP Versions that you saved", "color: green;");
            console.log("  |-- grabber.clear() - %c Clears the JSON", "color: green;");
            console.log("  |-- grabber.getJSON() - %c Gets the JSON to Paste in the VPS' Console", "color: green;");
        }

        return Object.freeze({
            logErr: logError,
            logInfo: logInfo,
            logStoredVersionExts: logStoredVersionExts,
            help: help
        });
    }());

    _finder = (function defineFinder() {
        function findVersionAmongSaved(verName) {
            for (let i = 0; i < allPHPExtensions.length; i++) {
                if (allPHPExtensions[i].version === verName) {
                    return allPHPExtensions[i];
                }
            }

            return undefined;
        }

        function findVersIndex(verObj) {
            return allPHPExtensions.findIndex(function findIndCb(currStoredVerObj) {
                return currStoredVerObj === verObj;
            })
        }

        function findAvailablePhpVersionsOnThisCpanel(limitTo54AndAbove = true) {
            Array.from(document.getElementsByTagName("option")).map(function (currentValue) {
                if (limitTo54AndAbove) {
                    if (Number(currentValue.value) >= 5.4) {
                        availablePhpVersions.push(String(currentValue.value))
                    }
                }
                else {
                    availablePhpVersions.push(String(currentValue.value));
                }
            });
        }

        function processReturnedJson(arrayOfObjects) {
            arrayOfObjects.map((snglObject, index) => {
                _addThisVersion(availablePhpVersions[index], snglObject);
            });

            // TODO: Why?
            getJSON();
        }

        return {
            findVersionAmongSaved: findVersionAmongSaved,
            findVersIndex: findVersIndex,
            findAvailablePhpVersionsOnThisCpanel: findAvailablePhpVersionsOnThisCpanel,
            processReturnedJson: processReturnedJson
        }
    }());

    _auth = (function defineAuth() {
        function verifySelectedDomVer(ver) {
            ver = (ver + "")[0] + "." + (ver + "")[1];
            return document.querySelector("select[name=lveversion] option:checked").textContent === ver;
        }

        function veryExtArrNotEmpty() {
            return allPHPExtensions.length > 0;
        }

        return {
            verifySelectedDomVer: verifySelectedDomVer,
            veryExtArrNotEmpty: veryExtArrNotEmpty
        }
    }());

    api = (function defineManipulator() {
        function add54() {
            addCustom(54);
        }

        function rm54() {
            _rmVer(54);
        }

        function add55() {
            addCustom(55);
        }

        function rm55() {
            _rmVer(55);
        }

        function add56() {
            addCustom(56);
        }

        function rm56() {
            _rmVer(56);
        }

        function add70() {
            addCustom(70);
        }

        function rm70() {
            _rmVer(70);
        }

        function add71() {
            addCustom(71);
        }

        function rm71() {
            _rmVer(71);
        }

        function add72() {
            addCustom(72);
        }

        function rm72() {
            _rmVer(72);
        }

        function addCustom(ver) {
            if (!/^[\d]{2}$/.test(ver)) {
                _logger.logErr("Invalid Version, Enter a Number Like: 55, 71, 73, 74")
            } else if (!_auth.verifySelectedDomVer(ver)) {
                _logger.logErr("Wrong Version Selected");
            } else if (_finder.findVersionAmongSaved(ver)) {
                _logger.logErr("Version" + ver + " already saved");
            } else {
                allPHPExtensions.push({
                    version: ver,
                    extensions: _getVersionExtensions()
                });
                _logger.logInfo("Saved Extensions for " + ver);
            }
        }

        function rmCustom(ver) {
            if (!/^[\d]{2}$/.test(ver)) {
                _logger.logErr("Invalid Version, Enter a Number Like: 71, 72, 73, 74")
            }

            _rmVer(ver);
        }

        function reportStoredVersions() {
            if (!_auth.veryExtArrNotEmpty()) {
                _logger.logErr("NO EXTENSIONS SAVED");
            } else {
                _logger.logStoredVersionExts();
            }
        }

        function clear() {
            if (!_auth.veryExtArrNotEmpty()) {
                _logger.logErr("THERE ARE NO EXTENSIONS TO REMOVE");
            } else {
                allPHPExtensions = [];
                _logger.logInfo("ALL PHP EXTENSIONS REMOVED");
            }
        }

        function getJSON() {
            if (!_auth.veryExtArrNotEmpty()) {
                _logger.logErr("NO EXTENSIONS SAVED");
            } else {
                return JSON.stringify(allPHPExtensions);
            }
        }

        function _rmVer(ver) {
            var verObj = _finder.findVersionAmongSaved(ver),
                verInd = _finder.findVersIndex(verObj);

            if (verInd < 0) {
                _logger.logErr("VERSION NOT STORED");
            } else {
                allPHPExtensions.splice(verInd, 1);
                _logger.logInfo(`Version ${ver} removed`);
            }
        }

        function _getVersionExtensions() {
            var phpExtNames = Array.from(document.querySelectorAll("td:nth-child(odd):not(:empty)")),
                phpExtChkbx = Array.from(document.querySelectorAll("td:nth-child(even):not(:empty) input")),
                allExtns = [],
                chkdExtns = [];

            phpExtNames.forEach(function (e, i) {
                allExtns.push({
                    extName: e.innerText,
                    isChecked: phpExtChkbx[i].checked
                });
            });

            allExtns.forEach(function addChecked(extObj) {
                if (extObj.isChecked) {
                    chkdExtns.push(extObj.extName);
                }
            });

            return chkdExtns;
        }

        return {
            add54: add54,
            rm54: rm54,
            add55: add55,
            rm55: rm55,
            add56: add56,
            rm56: rm56,
            add70: add70,
            rm70: rm70,
            add71: add71,
            rm71: rm71,
            add72: add72,
            rm72: rm72,
            addCustom: addCustom,
            rmCustom: rmCustom,
            clear: clear,
            getJSON: getJSON,
            reportStoredVersions: reportStoredVersions
        }
    }());

    // TODO: Hanging out because it's dependency for _finder.processReturnedJson
    function getJSON() {
        if (!_auth.veryExtArrNotEmpty()) {
            _logger.logErr("NO EXTENSIONS SAVED");
        } else {
            return JSON.stringify(allPHPExtensions);
        }
    }

    // TODO: REFACTOR
    // Functionality -> api
    // Authentication -> _auth
    //
    function addAll() {
        _finder.findAvailablePhpVersionsOnThisCpanel();
        console.warn(`php vers: ${availablePhpVersions}`);
        if (!availablePhpVersions || availablePhpVersions.length === 0) {
            _logger.logErr("Something went wrong, contact this script developers.");
        }

        var fireRequestForEachVerExtns = availablePhpVersions.map(singleVersion => {
            return _sendPostToGetExtentionsForSpecificVer(singleVersion);
        });

        Promise.all(fireRequestForEachVerExtns).then(results => {
            _logger.logInfo(`All requests finished`);
            _finder.processReturnedJson(results);
        });

    }

    function addSelected(...versions) {
        //:TODO add checks and helping messages if the arguments are in wrong format
        var passedVersions = Array.from(arguments);
        passedVersions.map(ver => {
            availablePhpVersions.push(String(ver / 10));
        });


        var fireRequestForEachVersionGiven = passedVersions.map(singleVersion => {
            return _sendPostToGetExtentionsForSpecificVer(singleVersion / 10);
        });

        Promise.all(fireRequestForEachVersionGiven).then(results => {
            _logger.logInfo(`All requests for selected versions finished`);
            _finder.processReturnedJson(results);
        });
    }

    function _getVersionExtensionsFromObjectWithExts(singleObject) {
        let activeExtentionsForSingleVersion = [];
        singleObject.data.map(object => {
            if (object.status === 1) {
                activeExtentionsForSingleVersion.push(object.title);
            }
        });

        return activeExtentionsForSingleVersion;
    }

    function _sendPostToGetExtentionsForSpecificVer(ver) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest(),
                request_data = {"version": ver, "action": "extlist"};

            request.open("POST", uri); // uri defined in template
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    _logger.logInfo(`PhP extensions for ${ver} acquired`);
                    return resolve(JSON.parse(request.responseText))
                }
            };
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(encodeFormData(request_data));
        });
    }

    function _addThisVersion(version, objectWithExtentions) {
        allPHPExtensions.push({
            version: Number(version.split(".").join("")),
            extensions: _getVersionExtensionsFromObjectWithExts(objectWithExtentions)
        });
        _logger.logInfo(`Saved Extensions for ${version}`);
    }
    //
    //
    // TODO: REFACTOR

    (function displayHelp() {
        _logger.help();
    }());

    // TODO: adAll, addSelected not returned, fix bugs
    return Object.freeze({
        add54: api.add54,
        rm54: api.rm54,
        add55: api.add55,
        rm55: api.rm55,
        add56: api.add56,
        rm56: api.rm56,
        add70: api.add70,
        rm70: api.rm70,
        add71: api.add71,
        rm71: api.rm71,
        add72: api.add72,
        rm72: api.rm72,
        addCustom: api.addCustom,
        rmCustom: api.rmCustom,
        v: api.reportStoredVersions,
        getJSON: getJSON,
        clear: api.clear
    });
}());
