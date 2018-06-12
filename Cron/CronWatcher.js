let CronWatcher = (function defWatcher() {
    "use strict";
    const fs = require("fs");
    const {execSync} = require("child_process");
    const {LogMailer} = require("./mailer");

    var homeDir,
        accessLogFile,
        cronLogDir,
        hoursOfLastLogs;

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
            let lastHour = ("0" + (date.getHours() - 1)).slice(-2);
            let currHour = ("0" + date.getHours()).slice(-2);

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
            let logsIP = (ip + " ".repeat(8)).slice(0, 15);
            let logsDate = `${("0" + date.getDate()).slice(-2)}`;
            let logsMonth = (`${(this.monthsVerb[("0" + (date.getMonth() + 1)).slice(-2)])}` + " ".repeat(6)).slice(0, 9);
            let logsHour = ("0" + date.getHours()).slice(-2);
            let logsMin = ("0" + date.getMinutes()).slice(-2);
            let logsSec = ("0" + date.getSeconds()).slice(-2);
            let logsMethod = (method + " ".repeat(4)).slice(0, 7);
            return `${logsIP}  ${logsDate}/${logsMonth}  ${logsHour}:${logsMin}:${logsSec}  ${logsMethod}  ${url}`;
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

            if (!fs.existsSync(`${this.dir}/login`)) {
                fs.writeFile(`${this.dir}/login`, "", "utf8");
            }

            this.getLogFile = `${this.dir}/GET`;
            this.postLogFile = `${this.dir}/POST`;
            this.modifiedFilesLog = `${this.dir}/Modified`;
            this.otherMethodsLog = `${this.dir}/Methods`;
            this.loginLogFile = `${this.dir}/login`;
        }
    };

    let _logger = {
        createdFiles: {},

        manageLogEntry: function manageLogEntry(logFile, logsArr) {
            if (logsArr.length > 0) {
                let key = logFile.slice(logFile.lastIndexOf("/") + 1);
                let val = logsArr.join("\n");

                this.createdFiles[key] = val;

                fs.writeFileSync(logFile, val, "utf8");
            } else {
                fs.unlinkSync(logFile);
            }
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

        log: function log() {
            _dirManager.createDirStructure();

            // Log Modified Files
            let modifiedFiles = execSync("find ~/ -type f -mmin -60").toString();
            fs.writeFileSync(_dirManager.modifiedFilesLog, modifiedFiles, "utf8");

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

                    if (/wp-login|wp-admin/.test(url)) { // put in admin
                        _watcher.adminLogs.push(currLog);
                    }
                }
            });

            _logger.manageLogEntry(_dirManager.postLogFile, _watcher.postLogs);
            _logger.manageLogEntry(_dirManager.getLogFile, _watcher.getLogs);
            _logger.manageLogEntry(_dirManager.otherMethodsLog, _watcher.methods);
            _logger.manageLogEntry(_dirManager.loginLogFile, _watcher.adminLogs);

            if (Object.keys(_logger.createdFiles).length > 0) {
                let mailMsg = [];

                Object.keys(_logger.createdFiles).forEach(function accMailMsg(key) {
                    let currMsg = key + "\n";
                    currMsg += _logger.createdFiles[key];
                    mailMsg.push(currMsg);
                });

                LogMailer.sendLogs(mailMsg.join("\n\n"));
            }
        }
    };

    return publicAPI;
}());

module.exports = {CronWatcher};
