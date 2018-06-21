# JavaScrip crons tracking Apache access logs

Get information about Apache log files in the format:

1.1.1.1 - - [21/Jun/2018:03:52:20 +0200] "GET /favicon.ico HTTP/1.1" 200 - "https://dom.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"


And created log files for all Modified files, GET, POST logs, logs to /wp-admin and also emails the results

## Installation
1. npm install nodemailer
2. cPanel -> Create directory node_modules/watcher
3. Place files in node_modules/watcher/

## Configuration
### mailer.js

````javascript

LogMailer.setHost("");                  // Server, like node.hostname.tld
LogMailer.setPort();                    // 465 for TLS/SSL
LogMailer.setSecure();                  // true for TLS/SSL
LogMailer.setAuthUser("");              // Email account em@dom.com
LogMailer.setAuthPwd("");               // Email account's passwd
LogMailer.setSmtpFrom("");              // Email From header
LogMailer.setSmtpTo("");                // Receiving email account em@dom.com


````

### watcher-hourly-cron.js

````javascript

CronWatcher.setHomeDir("");             // cPanel's Home Dir /home/$USER
CronWatcher.setAccessLog("");           // Apache access log /home/$USER/access-logs/$LOG-FILE
CronWatcher.setCronLogDir("");          // Directory for storing logs
CronWatcher.setHoursOfLastLog();        // Hours for last logs 1
CronWatcher.setDomain("");              // Domain for logs dom.com

````

