let CronWatcher = (function defWatcher() {
    "use strict";
    const fs = require("fs");
    const {execSync} = require("child_process");
    const dns = require("dns");
    const {LogMailer} = require("./mailer");

    var homeDir,
        accessLogFile,
        cronLogDir,
        hoursOfLastLogs,
        domain,
        mailMsg = "";

    let _watcher = {
        postLogs: [],
        getLogs: [],
        methods: [],
        adminLogs: []
    };

    let _auth = {
        assertRealHomeDir: function assertRealHomeDir(dir) {
            let realHomeDir = execSync("echo ~").toString().trim();
            return realHomeDir === dir;
        },

        assertHomeDirAndCronFile: function assertHomeDirAndCronFile() {
            return homeDir && cronLogDir;
        },

        assertLogTime: function assertLogTime(date) {
            let logTimeStamp = Math.floor(date / 1000);
            let timeStampNow = Math.floor(Date.now() / 1000);
            let minTimeStamp = timeStampNow - (hoursOfLastLogs * 60 * 60);
            return logTimeStamp >= minTimeStamp;
        }
    };

    let _formatter = {
        monthsVerb: {
            "01": "January",
            "02": "February",
            "03": "March",
            "04": "April",
            "05": "May",
            "06": "June",
            "07": "July",
            "08": "August",
            "09": "September",
            "10": "October",
            "11": "November",
            "12": "December"
        },

        getDirDates: function getDirDates() {
            let date = new Date();
            let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            let lastHour = ("0" + date.getHours()).slice(-2);
            let currHour = ("0" + (date.getHours() + 1)).slice(-2);

            return [year, month, day, lastHour, currHour];
        },

        getRawLogs: function getRawLogs() {
            return fs.readFileSync(accessLogFile, "utf8")
                .split("\n")
                .filter(lr => lr !== "");
        },

        getClearLogs: function getClearLogs(rawLog) {
            let [ip, , , date, , method, url] = rawLog.split(" ");

            date = this.getClearDate(date.slice(1));
            method = method.slice(1);

            return [ip, date, method, url];
        },

        getClearDate: function getClearDate(rawDate) {
            let [DD, MM, YYYY, HH, M, S] = rawDate.split(/[/:]/);
            let date = new Date(`${DD} ${MM} ${YYYY}`);
            date.setHours(+HH, +M, +S);
            return date;
        },

        createLog: function createLog(ip, date, method, url) {
            let logsIP = (ip + " ".repeat(32)).slice(0, 39);

            // let logsDate = `${("0" + date.getDate()).slice(-2)}`;
            // let logsMonth = (`${(this.monthsVerb[("0" + (date.getMonth() + 1)).slice(-2)])}` + " ".repeat(6)).slice(0, 9);

            let logsHour = ("0" + date.getHours()).slice(-2);
            let logsMin = ("0" + date.getMinutes()).slice(-2);
            let logsSec = ("0" + date.getSeconds()).slice(-2);

            let logsMethod = (method + " ".repeat(4)).slice(0, 7);
            // return `${logsIP}  ${logsDate}/${logsMonth}  ${logsHour}:${logsMin}:${logsSec}  ${logsMethod}  ${url}`;

            return `${logsIP}  ${logsHour}:${logsMin}:${logsSec}  ${logsMethod}  ${url}`;
        }
    };

    let _dirManager = {
        dir: "",
        modifiedFilesLog: "",
        getLogFile: "",
        postLogFile: "",
        otherMethodsLog: "",
        loginLogFile: "",

        createDirStructure: function createDirStructure() {
            if (!_auth.assertHomeDirAndCronFile()) {
                throw new Error("Home Directory and Cron Log Directory aren't set.");
            }

            this.dir = `${homeDir}/${cronLogDir}`;

            let [year, month, day, lastHour, currHour] = _formatter.getDirDates();

            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, "0755");
            }

            this.dir = `${this.dir}/${year}`;
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, "0755");
            }

            this.dir = `${this.dir}/${month}-${_formatter.monthsVerb[month]}`;
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, "0755");
            }

            this.dir = `${this.dir}/${day}`;
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, "0755");
            }

            this.dir = `${this.dir}/${lastHour}-${currHour}`;
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, "0755");
            }

            if (!fs.existsSync(`${this.dir}/Modified`)) {
                fs.writeFile(`${this.dir}/Modified`, "", "utf8");
            }

            if (!fs.existsSync(`${this.dir}/GET`)) {
                fs.writeFile(`${this.dir}/GET`, "", "utf8");
            }

            if (!fs.existsSync(`${this.dir}/POST`)) {
                fs.writeFile(`${this.dir}/POST`, "", "utf8");
            }

            if (!fs.existsSync(`${this.dir}/Methods`)) {
                fs.writeFile(`${this.dir}/Methods`, "", "utf8");
            }

            if (!fs.existsSync(`${this.dir}/Login`)) {
                fs.writeFile(`${this.dir}/Login`, "", "utf8");
            }

            this.getLogFile = `${this.dir}/GET`;
            this.postLogFile = `${this.dir}/POST`;
            this.modifiedFilesLog = `${this.dir}/Modified`;
            this.otherMethodsLog = `${this.dir}/Methods`;
            this.loginLogFile = `${this.dir}/Login`;

            LogMailer.setSmtpSubject(`Node Logs ${day}/${month}/${year} ${lastHour} - ${currHour} ${domain}`);
        }
    };

    let _logger = {
        separator: "=".repeat(212),

        manageLogEntry: function manageLogEntry(logFile, logsArr) {
            if (logsArr.length > 0) {
                let request = logFile.slice(logFile.lastIndexOf("/") + 1);

                let methodInfo = {
                    ipInfo: {},
                    urls: {}
                };

                logsArr.forEach(function gatherMethodInfo(logRow) {
                    let [ip, time, method, url] = logRow.split(/\s+/);

                    if (!methodInfo.ipInfo[ip]) {
                        methodInfo.ipInfo[ip] = [];
                    }

                    if (!methodInfo.urls[url]) {
                        methodInfo.urls[url] = 0;
                    }

                    methodInfo.ipInfo[ip].push(`${time}  ${url}`);
                    methodInfo.urls[url]++;
                });

                let logInfo = this.accumulateMailMsg(request, methodInfo);
                fs.writeFileSync(logFile, logInfo, "utf8");
            } else {
                fs.unlinkSync(logFile);
            }
        },

        accumulateMailMsg: function accumulateMailMsg(request, methodInfo) {
            let currMsg = this.separator + "\n";
            currMsg += `|||>>> All ${request} logs:\n`;
            currMsg += this.separator + "\n";

            let uniqIPInfo = "";
            let ipLogsMsg = "";

            Object.keys(methodInfo.ipInfo).forEach(function storeIPInfo(currIP) {
                let currIPLogs = methodInfo.ipInfo[currIP];

                uniqIPInfo += `Reqs: ${("      " + currIPLogs.length).slice(-6)} | ${currIP}\n`;

                ipLogsMsg += `## ${currIP} \n`;
                // TODO: Get currIP rDNS / GeoIP info

                ipLogsMsg += currIPLogs.join("\n");
                ipLogsMsg += "\n\n";
            });

            currMsg += "Unique IP addresses:\n";
            currMsg += uniqIPInfo;
            currMsg += "\n";

            currMsg += ipLogsMsg;

            mailMsg += currMsg + "\n";
            return currMsg;
        },

        logModifiedFiles: function logModifiedFiles(modFiles) {
            mailMsg += this.separator + "\n";
            mailMsg += "|||>>> All Modified files:\n";
            mailMsg += this.separator + "\n";
            mailMsg += modFiles + "\n\n";
        }
    };

    let publicAPI = {
        setHomeDir: function setHomeDir(dir) {
            if (!_auth.assertRealHomeDir(dir)) {
                throw new Error("Home directory is incorrect");
            }
            homeDir = dir;
        },

        setCronLogDir: function setCronLogDir(dir) {
            cronLogDir = dir;
        },

        setAccessLog: function setAccessLog(accessLog) {
            if (!fs.existsSync(accessLog)) {
                throw new Error("Access Log file is incorrect");
            }
            accessLogFile = accessLog;
        },

        setHoursOfLastLog: function setHoursOfLastLog(hours) {
            hoursOfLastLogs = hours;
        },

        setDomain: function setDomain(inpDomain) {
            domain = inpDomain;
        },

        log: function log() {
            _dirManager.createDirStructure();

            // Log Modified Files
            let modifiedFiles = execSync("find ~/ -type f -mmin -60").toString();
            fs.writeFileSync(_dirManager.modifiedFilesLog, modifiedFiles, "utf8");
            _logger.logModifiedFiles(modifiedFiles);

            // Log Access Logs
            let logs = _formatter.getRawLogs();
            logs.forEach(function storeLogsInWatcher(rawLog) {
                let [ip, date, method, url] = _formatter.getClearLogs(rawLog);

                if (_auth.assertLogTime(date)) {
                    let currLog = _formatter.createLog(ip, date, method, url);

                    switch (method) {
                        case "GET":
                            _watcher.getLogs.push(currLog);
                            break;
                        case "POST":
                            _watcher.postLogs.push(currLog);
                            break;
                        default:
                            _watcher.methods.push(currLog);
                            break;
                    }

                    if (/wp-login\.php/.test(url)) { // put in admin
                        _watcher.adminLogs.push(currLog);
                    }
                }
            });

            _logger.manageLogEntry(_dirManager.loginLogFile, _watcher.adminLogs);
            _logger.manageLogEntry(_dirManager.postLogFile, _watcher.postLogs);
            _logger.manageLogEntry(_dirManager.getLogFile, _watcher.getLogs);
            _logger.manageLogEntry(_dirManager.otherMethodsLog, _watcher.methods);

            if (mailMsg.length > 0) {
                LogMailer.sendLogs(mailMsg);
            }
        }
    };

    return publicAPI;
}());

module.exports = {CronWatcher};
