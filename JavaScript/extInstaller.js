/**
 *     __        __   _       _   _           _     _____
 *     \ \      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___
 *      \ \ /\ / / _ \ '_ \  | |_| |/ _ \/ __| __| | |_ / _` |/ __/ _ \
 *       \ V  V /  __/ |_) | |  _  | (_) \__ \ |_  |  _| (_| | (_|  __/
 *        \_/\_/ \___|_.__/  |_| |_|\___/|___/\__| |_|  \__,_|\___\___|
 *
 *                     PHP Extension Installer v1.0
 */

var installer = (function defineInstaller() {
    "use strict";

    var versInfo = (function defineManager() {
        var php54 = {
            alwaysInstall: {
                "bz2": "switch_ea-php54-php-bz2",
                "calendar": "switch_ea-php54-php-calendar",
                "curl": "switch_ea-php54-php-curl",
                "exif": "switch_ea-php54-php-exif",
                "gettext": "switch_ea-php54-php-gettext",
                "gmp": "switch_ea-php54-php-gmp",
                "iconv": "switch_ea-php54-php-iconv"
            },
            map: {
                "bcmath": "switch_ea-php54-php-bcmath",
                "dba": "switch_ea-php54-php-dba",
                "enchant": "switch_ea-php54-php-enchant",
                "fileinfo": "switch_ea-php54-php-fileinfo",
                "gd": "switch_ea-php54-php-gd",
                "imap": "switch_ea-php54-php-imap",
                "intl": "switch_ea-php54-php-intl",
                "ldap": "switch_ea-php54-php-ldap",
                "mbstring": "switch_ea-php54-php-mbstring",
                "mcrypt": "switch_ea-php54-php-mcrypt",
                "mssql": "switch_ea-php54-php-mssql",
                "mysqlnd": "switch_ea-php54-php-mysqlnd",
                "odbc": "switch_ea-php54-php-odbc",
                "pdo": "switch_ea-php54-php-pdo",
                "pgsql": "switch_ea-php54-php-pgsql",
                "posix": "switch_ea-php54-php-posix",
                "pspell": "switch_ea-php54-php-pspell",
                "recode": "switch_ea-php54-php-recode",
                "snmp": "switch_ea-php54-php-snmp",
                "soap": "switch_ea-php54-php-soap",
                "sockets": "switch_ea-php54-php-sockets",
                "sourceguardian": "switch_ea-php54-php-sourceguardian",
                "suhosin": "switch_ea-php54-php-suhosin",
                "tidy": "switch_ea-php54-php-tidy",
                "xmlrpc": "switch_ea-php54-php-xmlrpc",
                "zip": "switch_ea-php54-php-zip"
            },
            installedByDefault: ["dom", "phar", "wddx", "xmlreader", "xmlwriter", "xsl", "json"],
            additionalInfo: {
                "ffmpeg": "FFMPEG Needs Installation for PHP 5.4",
                "imagick": "IMAGICK Needs Installation for PHP 5.4 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 5.4 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube",
                "magickwand": "MagickWand is the first step of installing ImageMagick - yum install ImageMagick-devel",
                "opcache": "NO opcache for PHP 5.4 in WHM, 5.5 or above",
                "phalcon": "NO phalcon for PHP 5.4 in WHM, 5.5 or above"
            },
            notAvailableOnVPS: [
                "apc", "apcu", "apm", "ares", "big_int", "bitset", "dbase", "dbx", "doublemetaphone",
                "eaccelerator", "eio", "functional", "gender", "geoip", "gmagick", "haru", "hidef",
                "htscanner", "http", "igbinary", "inclued", "inotify", "interbase", "jsmin", "libevent",
                "libsodium", "lzf", "mailparse", "memcache", "memcached", "mongo", "mongodb", "msgpack",
                "mysql", "mysqli", "ncurses", "nd_mysql", "nd_mysqli", "nd_pdo_mysql", "oauth", "oci8",
                "pdf", "pdo_dblib", "pdo_firebird", "pdo_mysql", "pdo_oci", "pdo_odbc", "pdo_pgsql",
                "pdo_sqlite", "quickhash", "radius", "rar", "redis", "rsync", "solr", "spl_types", "ssh2",
                "stats", "stem", "stomp", "sysvmsg", "sybase_ct", "sysvsem", "sysvshm", "timezonedb", "trader",
                "translit", "uploadprogress", "uri_template", "uuid", "weakref", "xcache", "xcache_3", "xdebug",
                "xrange", "yaf", "yaml", "yaz", "zend_guard_loader", "zmq"
            ]
        };

        return {
            php54: php54
        }
    }());


    var logger = (function defineLogger() {

    }());

    var enabler = (function defineEnabler() {
        function isEnabled(phpExtID) {
            return document.getElementById(phpExtID).getAttribute("aria-checked") === "true";
        }

        function enableExt(phpExtID) {
            document.getElementById(phpExtID).click();
        }

        return {
            isEnabled: isEnabled,
            enableExt: enableExt
        }
    }());

    // parse JSON
    // foreach ver:
    // install alwaysInstall
    // forEach exts -> install them
    // if any are installedByDef - notice
    // if any are in add info -> notice
    // if any are in notAva -> notice
    function install(phpExtJSON) {
        var cPanPHPVersInfo = JSON.parse(phpExtJSON);

        cPanPHPVersInfo.forEach(function (cPanelPHPVerInfo) {
            var predefInfo,
                extIdsToInstall = [],
                loggerInfo = {
                    alwaysInstalled: [],
                    alreadyInstalled: [],
                    currentlyInstalled: [],
                    additionalInfo: [],
                    notAvailableOnVPS: []
                };

            switch (cPanelPHPVerInfo.version) {
                case 54:
                    predefInfo = versInfo.php54;
                    break;
            }

            // ALWAYS INSTALL
            for (let extName in predefInfo.alwaysInstall) {
                if (!predefInfo.alwaysInstall.hasOwnProperty(extName)) {
                    continue;
                }

                let extId = predefInfo.alwaysInstall[extName];
                if (!enabler.isEnabled(extId)) {
                    extIdsToInstall.push(extId);
                    loggerInfo.alwaysInstalled.push(extName);
                } else {
                    loggerInfo.alreadyInstalled.push(extName);
                }
            }

            // INSTALL CPAN EXTS
            cPanelPHPVerInfo.extensions.forEach(function (currExtName) {
                if (predefInfo.notAvailableOnVPS.includes(currExtName)) {
                    // NOT AVAIL ON VPS INFO
                    loggerInfo.notAvailableOnVPS.push(currExtName);
                } else if (predefInfo.installedByDefault.includes(currExtName)) {
                    // ALREADY INSTALL BY DEF
                    loggerInfo.alreadyInstalled.push(currExtName);
                } else if (Object.keys(predefInfo.additionalInfo).includes(currExtName)) {
                    // SPECIAL CASES - ffmpeg, ImageMagick, etc
                    loggerInfo.additionalInfo.push(currExtName);
                } else {
                    let extId = predefInfo.map[currExtName];
                    if (!enabler.isEnabled(extId)) {
                        extIdsToInstall.push(extId);
                        loggerInfo.currentlyInstalled.push(currExtName);
                    } else {
                        loggerInfo.alreadyInstalled.push(currExtName);
                    }
                }
            });

            extIdsToInstall.forEach(e => {console.log(e); enabler.enableExt(e)});
        })
    }

    return {
        install: install
    }
}());
