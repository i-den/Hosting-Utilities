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

