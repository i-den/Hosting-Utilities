/**
 *     __        __   _       _   _           _     _____
 *     \ \      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___
 *      \ \ /\ / / _ \ '_ \  | |_| |/ _ \/ __| __| | |_ / _` |/ __/ _ \
 *       \ V  V /  __/ |_) | |  _  | (_) \__ \ |_  |  _| (_| | (_|  __/
 *        \_/\_/ \___|_.__/  |_| |_|\___/|___/\__| |_|  \__,_|\___\___|
 *
 *                       PHP Extension Grabber v1.1
 */

var grabber = (function defineGrabber() {
    "use strict";
    var allPHPExtensions = [],
        _logger,
        _finder;

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

    function _verifyCurrVersionDOM(ver) {
        return document.querySelector("select[name=lveversion] option:checked").textContent === ver;
    }

    function _verifyExtensionsNotEmpty() {
        return allPHPExtensions.length > 0;
    }

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

        return Object.freeze({
            logErr: logError,
            logInfo: logInfo,
            logStoredVersionExts: logStoredVersionExts
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

        return Object.freeze({
            findVersionAmongSaved: findVersionAmongSaved,
            findVersIndex: findVersIndex
        })
    }());

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

    function reportStoredVersions() {
        if (!_verifyExtensionsNotEmpty()) {
            _logger.logErr("NO EXTENSIONS SAVED");
        } else {
            _logger.logStoredVersionExts();
        }
    }

    function add54() {
        if (!_verifyCurrVersionDOM("5.4")) {
            _logger.logErr("Wrong Version Selected");
        } else if (_finder.findVersionAmongSaved(54)) {
            _logger.logErr("Version 5.4 already saved");
        } else {
            allPHPExtensions.push({
                version: 54,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 5.4");
        }
    }

    function rm54() {
        _rmVer(54);
    }

    function add55() {
        if (!_verifyCurrVersionDOM("5.5")) {
            _logger.logErr("Wrong Version Selected");
        } else if (_finder.findVersionAmongSaved(55)) {
            _logger.logErr("Version 5.5 already saved");
        } else {
            allPHPExtensions.push({
                version: 55,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 5.5");
        }
    }

    function rm55() {
        _rmVer(55);
    }

    function add56() {
        if (!_verifyCurrVersionDOM("5.6")) {
            _logger.logErr("Wrong Version Selected");
        } else if (_finder.findVersionAmongSaved(56)) {
            _logger.logErr("Version 5.6 already saved");
        } else {
            allPHPExtensions.push({
                version: 56,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 5.6");
        }
    }

    function rm56() {
        _rmVer(56);
    }

    function add70() {
        if (!_verifyCurrVersionDOM("7.0")) {
            _logger.logErr("Wrong Version Selected");
        }  else if (_finder.findVersionAmongSaved(70)) {
            _logger.logErr("Version 7.0 already saved");
        } else {
            allPHPExtensions.push({
                version: 70,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 7.0");
        }
    }

    function rm70() {
        _rmVer(70);
    }

    function add71() {
        if (!_verifyCurrVersionDOM("7.1")) {
            _logger.logErr("Wrong Version Selected");
        }  else if (_finder.findVersionAmongSaved(71)) {
            _logger.logErr("Version 7.1 already saved");
        } else {
            allPHPExtensions.push({
                version: 71,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 7.1");
        }
    }

    function rm71() {
        _rmVer(71);
    }

    function add72() {
        if (!_verifyCurrVersionDOM("7.2")) {
            _logger.logErr("Wrong Version Selected");
        }  else if (_finder.findVersionAmongSaved(72)) {
            _logger.logErr("Version 7.2 already saved");
        } else {
            allPHPExtensions.push({
                version: 72,
                extensions: _getVersionExtensions()
            });
            _logger.logInfo("Saved Extensions for 7.2");
        }
    }

    function rm72() {
        _rmVer(72);
    }

    function clear() {
        if (!_verifyExtensionsNotEmpty()) {
            _logger.logErr("THERE ARE NO EXTENSIONS TO REMOVE");
        } else {
            allPHPExtensions = [];
            _logger.logInfo("ALL PHP EXTENSIONS REMOVED");
        }
    }

    function getJSON() {
        if (!_verifyExtensionsNotEmpty()) {
            _logger.logErr("NO EXTENSIONS SAVED");
        } else {
            return JSON.stringify(allPHPExtensions);
        }
    }

    return Object.freeze({
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
        v: reportStoredVersions,
        getJSON: getJSON,
        clear: clear
    });
}());
