const {CronWatcher} = require("./watcher.js");

CronWatcher.setHomeDir();          // /home/$USER
CronWatcher.setAccessLog();        // /home/$USER/access-logs/example.com-ssl_log
CronWatcher.setCronLogDir();     
CronWatcher.setHoursOfLastLog();   // 1

CronWatcher.log();
