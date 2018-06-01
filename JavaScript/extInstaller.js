/**
 *     __        __   _       _   _           _     _____
 *     \ \      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___
 *      \ \ /\ / / _ \ '_ \  | |_| |/ _ \/ __| __| | |_ / _` |/ __/ _ \
 *       \ V  V /  __/ |_) | |  _  | (_) \__ \ |_  |  _| (_| | (_|  __/
 *        \_/\_/ \___|_.__/  |_| |_|\___/|___/\__| |_|  \__,_|\___\___|
 *
 *                     PHP Extension Installer v1.1
 */

var installer = (function defineInstaller() {
    "use strict";
    var _predefinedPHPVersInfo,
        _logger,
        _enabler;

    _predefinedPHPVersInfo = {
        php54: {
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
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
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
        },
        php55: {
            alwaysInstall: {
                "bz2": "switch_ea-php55-php-bz2",
                "calendar": "switch_ea-php55-php-calendar",
                "curl": "switch_ea-php55-php-curl",
                "exif": "switch_ea-php55-php-exif",
                "ftp": "switch_ea-php55-php-ftp",
                "gettext": "switch_ea-php55-php-gettext",
                "gmp": "switch_ea-php55-php-gmp",
                "iconv": "switch_ea-php55-php-iconv",
                "xml": "switch_ea-php55-php-xml"
            },
            map: {
                "bcmath": "switch_ea-php55-php-bcmath",
                "dba": "switch_ea-php55-php-dba",
                "enchant": "switch_ea-php55-php-enchant",
                "fileinfo": "switch_ea-php55-php-fileinfo",
                "gd": "switch_ea-php55-php-gd",
                "imap": "switch_ea-php55-php-imap",
                "intl": "switch_ea-php55-php-intl",
                "ldap": "switch_ea-php55-php-ldap",
                "mbstring": "switch_ea-php55-php-mbstring",
                "mcrypt": "switch_ea-php55-php-mcrypt",
                "mysqlnd": "switch_ea-php55-php-mysqlnd",
                "odbc": "switch_ea-php55-php-odbc",
                "opcache": "switch_ea-php55-php-opcache",
                "pdo": "switch_ea-php55-php-pdo",
                "pgsql": "switch_ea-php55-php-pgsql",
                "phalcon": "switch_ea-php55-php-phalcon",
                "posix": "switch_ea-php55-php-posix",
                "pspell": "switch_ea-php55-php-pspell",
                "recode": "switch_ea-php55-php-recode",
                "snmp": "switch_ea-php55-php-snmp",
                "soap": "switch_ea-php55-php-soap",
                "sockets": "switch_ea-php55-php-sockets",
                "sourceguardian": "switch_ea-php55-php-sourceguardian",
                "suhosin": "switch_ea-php55-php-suhosin",
                "tidy": "switch_ea-php55-php-tidy",
                "xmlrpc": "switch_ea-php55-php-xmlrpc",
                "zip": "switch_ea-php55-php-zip"
            },
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
            additionalInfo: {
                "ffmpeg": "FFMPEG Needs Installation for PHP 5.5",
                "imagick": "IMAGICK Needs Installation for PHP 5.5 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 5.5 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube",
                "magickwand": "MagickWand is the first step of installing ImageMagick - yum install ImageMagick-devel"
            },
            notAvailableOnVPS: [
                "apcu", "apm", "ares", "big_int", "bitset", "brotli", "bz2_filter", "dbase", "dbx",
                "doublemetaphone", "eio", "gender", "geoip", "gmagick", "gnupg", "haru", "hidef", "htscanner",
                "http", "igbinary", "inotify", "interbase", "ioncube_loader_4", "jsmin", "libevent",
                "libsodium", "lzf", "mailparse", "memcache", "memcached", "mongo", "mongodb", "msgpack",
                "mssql", "mysql", "mysqli", "ncurses", "nd_mysql", "nd_mysqli", "nd_pdo_mysql", "oauth",
                "oci8", "pdf", "pdo_dblib", "pdo_firebird", "pdo_mysql", "pdo_oci", "pdo_odbc", "pdo_pgsql",
                "pdo_sqlite", "phalcon3", "propro", "quickhash", "radius", "raphf", "rar", "redis", "rsync",
                "solr", "spl_types", "ssh2", "stats", "stem", "stomp", "sybase_ct", "sysvmsg", "sysvsem",
                "sysvshm", "timezonedb", "trader", "translit", "uploadprogress", "uri_template", "uuid",
                "weakref", "xcache_3", "xdebug", "xrange", "yaf", "yaml", "yaz", "zend_guard_loader", "zmq"
            ]
        },
        php56: {
            alwaysInstall: {
                "bz2": "switch_ea-php56-php-bz2",
                "calendar": "switch_ea-php56-php-calendar",
                "curl": "switch_ea-php56-php-curl",
                "exif": "switch_ea-php56-php-exif",
                "ftp": "switch_ea-php56-php-ftp",
                "gettext": "switch_ea-php56-php-gettext",
                "gmp": "switch_ea-php56-php-gmp",
                "iconv": "switch_ea-php56-php-iconv",
                "xml": "switch_ea-php56-php-xml"
            },
            map: {
                "bcmath": "switch_ea-php56-php-bcmath",
                "dba": "switch_ea-php56-php-dba",
                "enchant": "switch_ea-php56-php-enchant",
                "fileinfo": "switch_ea-php56-php-fileinfo",
                "gd": "switch_ea-php56-php-gd",
                "imap": "switch_ea-php56-php-imap",
                "intl": "switch_ea-php56-php-intl",
                "ldap": "switch_ea-php56-php-ldap",
                "mbstring": "switch_ea-php56-php-mbstring",
                "mcrypt": "switch_ea-php56-php-mcrypt",
                "mssql": "switch_ea-php56-php-mssql",
                "mysqlnd": "switch_ea-php56-php-mysqlnd",
                "odbc": "switch_ea-php56-php-odbc",
                "opcache": "switch_ea-php56-php-opcache",
                "pdo": "switch_ea-php56-php-pdo",
                "pgsql": "switch_ea-php56-php-pgsql",
                "phalcon": "switch_ea-php56-php-phalcon",
                "posix": "switch_ea-php56-php-posix",
                "pspell": "switch_ea-php56-php-pspell",
                "snmp": "switch_ea-php56-php-snmp",
                "soap": "switch_ea-php56-php-soap",
                "sockets": "switch_ea-php56-php-sockets",
                "sourceguardian": "switch_ea-php56-php-sourceguardian",
                "suhosin": "switch_ea-php56-php-suhosin",
                "tidy": "switch_ea-php56-php-tidy",
                "xmlrpc": "switch_ea-php56-php-xmlrpc",
                "zip": "switch_ea-php56-php-zip"
            },
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
            additionalInfo: {
                "ffmpeg": "FFMPEG Needs Installation for PHP 5.6",
                "imagick": "IMAGICK Needs Installation for PHP 5.6 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 5.6 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube",
                "recode": "recode extension enabled, fix dependencies manually if it's absolutely necessary"
            },
            notAvailableOnVPS: [
                "apcu", "apm", "ares", "big_int", "bitset", "brotli", "bz2_filter", "dbx",
                "doublemetaphone", "eio", "gender", "geoip", "gmagick", "gnupg", "haru", "htscanner",
                "http", "igbinary", "inotify", "interbase", "ioncube_loader_4", "jsmin", "libevent",
                "libsodium", "lzf", "mailparse", "memcache", "memcached", "mongo", "mongodb", "msgpack",
                "mysql", "mysqli", "ncurses", "nd_mysql", "nd_mysqli", "nd_pdo_mysql", "oauth", "oci8",
                "pdf", "pdo_dblib", "pdo_firebird", "pdo_mysql", "pdo_oci", "pdo_odbc", "pdo_pgsql", "pdo_sqlite",
                "phalcon3", "propro", "quickhash", "radius", "raphf", "rar", "redis", "rsync", "solr", "spl_types",
                "ssh2", "stats", "stem", "stomp", "sybase_ct", "sysvmsg", "sysvsem", "sysvshm", "timezonedb",
                "trader", "translit", "uploadprogress", "uri_template", "uuid", "weakref", "xcache_3", "xdebug",
                "xrange", "yaml", "yaz", "zend_guard_loader", "zmq"
            ]
        },
        php70: {
            alwaysInstall: {
                "bz2": "switch_ea-php70-php-bz2",
                "calendar": "switch_ea-php70-php-calendar",
                "curl": "switch_ea-php70-php-curl",
                "exif": "switch_ea-php70-php-exif",
                "ftp": "switch_ea-php70-php-ftp",
                "gettext": "switch_ea-php70-php-gettext",
                "gmp": "switch_ea-php70-php-gmp",
                "iconv": "switch_ea-php70-php-iconv",
                "xml": "switch_ea-php70-php-xml"
            },
            map: {
                "bcmath": "switch_ea-php70-php-bcmath",
                "dba": "switch_ea-php70-php-dba",
                "enchant": "switch_ea-php70-php-enchant",
                "fileinfo": "switch_ea-php70-php-fileinfo",
                "gd": "switch_ea-php70-php-gd",
                "imap": "switch_ea-php70-php-imap",
                "intl": "switch_ea-php70-php-intl",
                "ldap": "switch_ea-php70-php-ldap",
                "mbstring": "switch_ea-php70-php-mbstring",
                "mcrypt": "switch_ea-php70-php-mcrypt",
                "mysqlnd": "switch_ea-php70-php-mysqlnd",
                "odbc": "switch_ea-php70-php-odbc",
                "opcache": "witch_ea-php70-php-opcache",
                "pdo": "switch_ea-php70-php-pdo",
                "pgsql": "switch_ea-php70-php-pgsql",
                "posix": "switch_ea-php70-php-posix",
                "pspell": "switch_ea-php70-php-pspell",
                "snmp": "switch_ea-php70-php-snmp",
                "soap": "switch_ea-php70-php-soap",
                "sockets": "switch_ea-php70-php-sockets",
                "sourceguardian": "switch_ea-php70-php-sourceguardian",
                "tidy": "switch_ea-php70-php-tidy",
                "xmlrpc": "switch_ea-php70-php-xmlrpc",
                "zip": "switch_ea-php70-php-zip",
                "phalcon3": "switch_ea-php70-php-phalcon"
            },
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
            additionalInfo: {
                "imagick": "IMAGICK Needs Installation for PHP 7.0 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 7.0 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube",
            },
            notAvailableOnVPS: [
                "apcu", "bitset", "brotli", "dbase", "eio", "gender", "geoip", "gmagick", "gnupg", "htscanner", "http", "igbinary",
                "inotify", "interbase", "libsodium", "lzf", "mailparse", "memcached", "mongodb", "mysqli", "nd_mysqli", "nd_pdo_mysql",
                "oauth", "oci8", "pdf", "pdo_dblib", "pdo_firebird", "pdo_mysql", "pdo_oci", "pdo_odbc", "pdo_pgsql", "pdo_sqlite",
                "pdo_sqlsrv", "propro", "raphf", "rar", "redis", "solr", "sqlsrv", "ssh2", "stats", "suhosin", "sysvmsg",
                "sysvsem", "sysvshm", "timezonedb", "trader", "uploadprogress", "uuid", "vips", "yaf", "xdebug", "yaml", "yaz", "zmq"
            ]
        },
        php71: {
            alwaysInstall: {
                "bz2": "switch_ea-php71-php-bz2",
                "calendar": "switch_ea-php71-php-calendar",
                "curl": "switch_ea-php71-php-curl",
                "exif": "switch_ea-php71-php-exif",
                "ftp": "switch_ea-php71-php-ftp",
                "gettext": "switch_ea-php71-php-gettext",
                "gmp": "switch_ea-php71-php-gmp",
                "iconv": "switch_ea-php71-php-iconv"
            },
            map: {
                "bcmath": "switch_ea-php71-php-bcmath",
                "dba": "switch_ea-php71-php-dba",
                "enchant": "switch_ea-php71-php-enchant",
                "fileinfo": "switch_ea-php71-php-fileinfo",
                "gd": "switch_ea-php71-php-gd",
                "imap": "switch_ea-php71-php-imap",
                "intl": "switch_ea-php71-php-intl",
                "ldap": "switch_ea-php71-php-ldap",
                "mbstring": "switch_ea-php71-php-mbstring",
                "mcrypt": "switch_ea-php71-php-mcrypt",
                "mysqlnd": "switch_ea-php71-php-mysqlnd",
                "odbc": "switch_ea-php71-php-odbc",
                "opcache": "switch_ea-php71-php-opcache",
                "pdo": "switch_ea-php71-php-pdo",
                "pgsql": "switch_ea-php71-php-pgsql",
                "phalcon3": "switch_ea-php71-php-phalcon",
                "posix": "switch_ea-php71-php-posix",
                "pspell": "switch_ea-php71-php-pspell",
                "snmp": "switch_ea-php71-php-snmp",
                "soap": "switch_ea-php71-php-soap",
                "sockets": "switch_ea-php71-php-sockets",
                "tidy": "switch_ea-php71-php-tidy",
                "xmlrpc": "switch_ea-php71-php-xmlrpc",
                "zip": "switch_ea-php71-php-zip"
            },
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
            additionalInfo: {
                "imagick": "IMAGICK Needs Installation for PHP 7.1 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 7.0 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube"
            },
            notAvailableOnVPS: [
                "apcu", "libxml", "brotli", "dbase", "eio", "gender", "geoip", "gmagick", "gnupg", "htscanner", "http",
                "igbinary", "inotify", "interbase", "libsodium", "lzf", "mailparse", "memcached", "mongodb",
                "mysqli", "nd_mysqli", "nd_pdo_mysql", "oauth", "oci8", "pdo_dblib", "pdo_firebird", "pdo_mysql",
                "pdo_oci", "pdo_odbc", "pdo_pgsql", "pdo_sqlite", "pdo_sqlsrv", "propro", "raphf", "rar", "redis",
                "solr", "sourceguardian", "sqlsrv", "ssh2", "stats", "suhosin", "sysvmsg", "sysvsem", "sysvshm",
                "timezonedb", "trader", "uploadprogress", "uuid", "vips", "xdebug", "yaf", "yaml", "zmq"
            ]
        },
        php72: {
            alwaysInstall: {
                "bz2": "switch_ea-php72-php-bz2",
                "calendar": "switch_ea-php72-php-calendar",
                "curl": "switch_ea-php72-php-curl",
                "exif": "switch_ea-php72-php-exif",
                "ftp": "switch_ea-php72-php-ftp",
                "gettext": "switch_ea-php72-php-gettext",
                "gmp": "switch_ea-php72-php-gmp",
                "iconv": "switch_ea-php72-php-iconv"
            },
            map: {
                "bcmath": "switch_ea-php72-php-bcmath",
                "dba": "switch_ea-php72-php-dba",
                "enchant": "switch_ea-php72-php-enchant",
                "fileinfo": "switch_ea-php72-php-fileinfo",
                "gd": "switch_ea-php72-php-gd",
                "imap": "switch_ea-php72-php-imap",
                "intl": "switch_ea-php72-php-intl",
                "ldap": "switch_ea-php72-php-ldap",
                "mbstring": "switch_ea-php72-php-mbstring",
                "mysqlnd": "switch_ea-php72-php-mysqlnd",
                "odbc": "switch_ea-php72-php-odbc",
                "opcache": "switch_ea-php72-php-opcache",
                "pdo": "switch_ea-php72-php-pdo",
                "pgsql": "switch_ea-php72-php-pgsql",
                "posix": "switch_ea-php72-php-posix",
                "pspell": "switch_ea-php72-php-pspell",
                "snmp": "switch_ea-php72-php-snmp",
                "soap": "switch_ea-php72-php-soap",
                "sockets": "switch_ea-php72-php-sockets",
                "tidy": "switch_ea-php72-php-tidy",
                "xmlrpc": "switch_ea-php72-php-xmlrpc",
                "zip": "switch_ea-php72-php-zip"
            },
            installedByDefault: ["dom", "json", "phar", "wddx", "xmlreader", "xmlwriter", "xsl"],
            additionalInfo: {
                "imagick": "IMAGICK Needs Installation for PHP 7.2 - yum install ImageMagick-devel | WHM -> Module Installers -> PHP Pecl [Manage] -> imagick",
                "ioncube_loader": "IONCUBE NEEDED for PHP 7.0 - WHM -> Tweak Settings -> PHP -> cPanel PHP loader -> ioncube",
                "phalcon3": "phalcon isn't available on PHP 7.2"
            },
            notAvailableOnVPS: [
                "apcu", "brotli", "dbase", "eio", "gender", "geoip", "gmagick", "gnupg", "http",
                "igbinary", "inotify", "interbase", "lzf", "mailparse", "memcached", "mongodb",
                "mysqli", "nd_mysqli", "nd_pdo_mysql", "oauth", "oci8", "pdo_dblib", "pdo_firebird",
                "pdo_mysql", "pdo_oci", "pdo_odbc", "pdo_pgsql", "pdo_sqlite", "pdo_sqlsrv", "propro",
                "raphf", "redis", "sqlsrv", "ssh2", "stats", "sysvmsg", "sysvsem", "sysvshm", "timezonedb",
                "trader", "uploadprogress", "uuid", "vips", "xdebug", "yaf", "yaml", "zmq"
            ]
        }
    };

    _logger = (function defineLogger() {
        var style = "background: #444853; border-radius: 2px; line-height: 18px;";

        function logExtensions(extArr, msg) {
            var css = [];
            extArr = extArr.map(e => {
                css.push(style + "color: white; margin: 1px;");
                return `%c ${e} `;
            });

            console.log(`%c  |-- ${msg}: `, style + "color: #8daed6;");
            console.log(extArr.join(""), ...css);
        }

        function logWarnings(ver, warnings) {
            console.log(`%c   Warnings for ${ver.substr(0, 3).toUpperCase()} ${ver.slice(-2)}    `, style + "color: red;");
            warnings.forEach(function (warning) {
                console.log(`%c ${warning} `, style + "color: white;")
            });
        }

        function logError(msg) {
            console.log(`%c   ${msg}    `, style + "color: red;");
        }

        function help() {
            {
                let $_$ = ` __        __   _       _   _           _     _____              
 \\ \\      / /__| |__   | | | | ___  ___| |_  |  ___|_ _  ___ ___ 
  \\ \\ /\\ / / _ \\ '_ \\  | |_| |/ _ \\/ __| __| | |_ / _\` |/ __/ _ \\
   \\ V  V /  __/ |_) | |  _  | (_) \\__ \\ |_  |  _| (_| | (_|  __/
    \\_/\\_/ \\___|_.__/  |_| |_|\\___/|___/\\__| |_|  \\__,_|\\___\\___|
                                                                 
                    PHP Extension Installer v1.1
     https://github.com/i-den/utilities/tree/master/JavaScript
                    
                    `;

                console.log($_$);
            }

            console.log("%c \\-- Copy the JSON from, check PHP versions that will be used then ", style + "color: #8daed6;");
            console.log("  |-- installer.install(`JSON_GOES_HERE`) - %c The (` `) ARE MANDATORY", "color: green;");
        }

        return {
            logExtensions: logExtensions,
            logWarnings: logWarnings,
            help: help,
            logErr: logError
        }
    }());

    _enabler = (function defineEnabler() {
        function isEnabled(phpExtID) {
            var attr = document.getElementById(phpExtID).getAttribute("aria-checked");
            return attr === "true" || attr === "Unaffected" || attr === "Install";
        }

        function enableExt(phpExtID) {
            document.getElementById(phpExtID).click();
        }

        return {
            isEnabled: isEnabled,
            enableExt: enableExt
        }
    }());

    function install(phpExtJSON) {
        if (document.getElementById("pageSize_extensions_select").selectedOptions[0].text !== "All") {
            _logger.logErr("!! Select ALL from Page Size to View Everything !!");
            return;
        }

        var cPanPHPVersInfo = JSON.parse(phpExtJSON),
            warnings = {
                php54: [],
                php55: [],
                php56: [],
                php70: [],
                php71: [],
                php72: []
            };

        // Foreach JSON Version Objects
        cPanPHPVersInfo.forEach(function (currcPanelPHPVerInfo) {
            var currPredPHPVerInfo,
                extIdsToInstall = [],
                loggerInfo = {
                    alwaysInstalled: [],
                    alreadyInstalled: [],
                    currentlyInstalled: [],
                    notAvailableOnVPS: [],
                    notRecognized: []
                };

            switch (currcPanelPHPVerInfo.version) {
                case 54:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php54;
                    break;
                case 55:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php55;
                    break;
                case 56:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php56;
                    break;
                case 70:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php70;
                    break;
                case 71:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php71;
                    break;
                case 72:
                    currPredPHPVerInfo = _predefinedPHPVersInfo.php72;
                    break;
            }

            // Foreach PHP Extensions for installation
            currcPanelPHPVerInfo.extensions.forEach(function (currExtName) {
                if (currPredPHPVerInfo.notAvailableOnVPS.includes(currExtName)) {
                    // Extensions That Are Not Available on a VPS
                    loggerInfo.notAvailableOnVPS.push(currExtName);
                } else if (currPredPHPVerInfo.installedByDefault.includes(currExtName)) {
                    // Extensions That Are Already Installed or Scheduled for Installation
                    loggerInfo.alreadyInstalled.push(currExtName);
                } else if (Object.keys(currPredPHPVerInfo.additionalInfo).includes(currExtName)) {
                    // Special Cases like ffmpeg, ImageMagick etc...
                    warnings["php" + currcPanelPHPVerInfo.version].push(currPredPHPVerInfo.additionalInfo[currExtName]);
                } else if (Object.keys(currPredPHPVerInfo.map).includes(currExtName)){
                    // Extensions That Are Pre-Defined and Should Be Installed
                    let extId = currPredPHPVerInfo.map[currExtName];
                    if (!_enabler.isEnabled(extId)) {
                        extIdsToInstall.push(extId);
                        loggerInfo.currentlyInstalled.push(currExtName);
                    } else {
                        loggerInfo.alreadyInstalled.push(currExtName);
                    }
                } else {
                    // Extensions That Are Not Taken Into Consideration by the Script
                    loggerInfo.notRecognized.push(currExtName);
                }
            });

            // Foreach PHP Extensions That Are Necessary
            Object.keys(currPredPHPVerInfo.alwaysInstall).forEach(function (extName) {
                var extId = currPredPHPVerInfo.alwaysInstall[extName];
                if (!_enabler.isEnabled(extId)) {
                    extIdsToInstall.push(extId);
                    loggerInfo.alwaysInstalled.push(extName);
                } else {
                    loggerInfo.alreadyInstalled.push(extName);
                }
            });

            // Foreach Enable Extensions for Installation
            extIdsToInstall.forEach(function (id) {
                _enabler.enableExt(id);
            });

            console.log("%c \\-- Info for PHP " + currcPanelPHPVerInfo.version + " ", "background: #444853; border-radius: 2px; line-height: 18px; color: #b6d580;");
            if (loggerInfo.alwaysInstalled.length > 0) {
                _logger.logExtensions(loggerInfo.alwaysInstalled, "Necessary Shared Hosting Extensions Scheduled for Installation ");
            }

            if (loggerInfo.alreadyInstalled.length > 0) {
                _logger.logExtensions(loggerInfo.alreadyInstalled, "Extensions Already Scheduled for Installation or Installed");
            }

            if (loggerInfo.currentlyInstalled.length > 0) {
                _logger.logExtensions(loggerInfo.currentlyInstalled, "Extensions Used in cPanel for Installation")
            }

            if (loggerInfo.notAvailableOnVPS.length > 0) {
                _logger.logExtensions(loggerInfo.notAvailableOnVPS, "!! NOT AVAILABLE ON VPS !!");
            }

            if (loggerInfo.notRecognized.length > 0) {
                _logger.logExtensions(loggerInfo.notRecognized, "!! NOT RECOGNIZED BY SCRIPT !!");
            }

            console.log("");
        });

        // Foreach Display Warnings for Each Version
        Object.keys(warnings).forEach(function (currPhpWarn) {
            if (warnings[currPhpWarn].length > 0) {
                _logger.logWarnings(currPhpWarn, warnings[currPhpWarn]);
            }
        })
    }

    (function displayHelp() {
        _logger.help()
    }());

    return Object.freeze({
        install: install
    })
}());
