/**
 *     __        __   _       _   _           _     _____
 *     \ \      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___
 *      \ \ /\ / / _ \ '_ \  | |_| |/ _ \/ __| __| | |_ / _` |/ __/ _ \
 *       \ V  V /  __/ |_) | |  _  | (_) \__ \ |_  |  _| (_| | (_|  __/
 *        \_/\_/ \___|_.__/  |_| |_|\___/|___/\__| |_|  \__,_|\___\___|
 *
 *                       PHP Extension Grabber v1.0
 */

var grabber = (function defineGrabber() {
    "use strict";
    var allPHPExtensions = [],
        logger;


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

    function _verifyVersion(ver) {
        return document.querySelector("select[name=lveversion] option:checked").textContent === ver;
    }

    function _verifyExtensionsAny() {
        return allPHPExtensions.length > 0;
    }

    logger = (function defineLogger() {
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

    function reportStoredVersions() {
        if (!_verifyExtensionsAny()) {
            logger.logErr("NO EXTENSIONS SAVED");
        } else {
            logger.logStoredVersionExts();
        }
    }

    function add54() {
        if (!_verifyVersion("5.4")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 54,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 5.4");
        }
    }

    function add55() {
        if (!_verifyVersion("5.5")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 55,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 5.5");
        }
    }

    function add56() {
        if (!_verifyVersion("5.6")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 56,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 5.6");
        }
    }

    function add70() {
        if (!_verifyVersion("7.0")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 70,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 7.0");
        }
    }

    function add71() {
        if (!_verifyVersion("7.1")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 71,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 7.1");
        }
    }

    function add72() {
        if (!_verifyVersion("7.2")) {
            logger.logErr("Wrong Version Selected");
        } else {
            allPHPExtensions.push({
                version: 72,
                extensions: _getVersionExtensions()
            });
            logger.logInfo("Saved Extensions for 7.2");
        }
    }

    function clear() {
        if  (!_verifyExtensionsAny()) {
            logger.logErr("THERE ARE NO EXTENSIONS TO REMOVE");
        } else {
            allPHPExtensions = [];
            logger.logInfo("ALL PHP EXTENSIONS REMOVED");
        }
    }

    function getJSON() {
        if (!_verifyExtensionsAny()) {
            logger.logErr("NO EXTENSIONS SAVED");
        } else {
            return JSON.stringify(allPHPExtensions);
        }
    }

    return Object.freeze({
        add54: add54,
        add55: add55,
        add56: add56,
        add70: add70,
        add71: add71,
        add72: add72,
        v: reportStoredVersions,
        getJSON: getJSON,
        clear: clear
    });
}());
