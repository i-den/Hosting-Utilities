let LogMailer = (function defLogMailer() {
    "use strict";
    const nodemailer = require("nodemailer");

    var host,
        port,
        secure,
        authUser,
        authPwd,
        smtpFrom,
        smtpTo,
        smtpSubject;

    function sendLogs(logs) {
        if (!(host && port && secure && authUser && authPwd && smtpFrom && smtpTo && smtpSubject)) {
            throw new Error("Configure your SMTP settings!");
        }

        let transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: authUser,
                pass: authPwd
            }
        });

        let mailOptions = {
            from: smtpFrom,
            to: smtpTo,
            subject: smtpSubject,
            text: logs
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
    }

    let publicAPI = {
        setHost: function setHost(inpHost) {
            host = inpHost;
        },

        setPort: function setPort(inpPort) {
            port = inpPort;
        },

        setSecure: function setSecure(inpSecure) {
            secure = inpSecure;
        },

        setAuthUser: function setAuthUser(inpAuthUser) {
            authUser = inpAuthUser;
        },

        setAuthPwd: function setAuthUser(inpAuthPwd) {
            authPwd = inpAuthPwd;
        },

        setSmtpFrom: function setSmtpFrom(inpSmtpFrom) {
            smtpFrom = inpSmtpFrom;
        },

        setSmtpTo: function setSmtpFrom(inpSmtpTo) {
            smtpTo = inpSmtpTo;
        },

        setSmtpSubject: function setSmtpSubject(inpSmtpSubject) {
            smtpSubject = inpSmtpSubject;
        },

        sendLogs
    };

    return publicAPI;
}());

LogMailer.setHost();
LogMailer.setPort();
LogMailer.setSecure();
LogMailer.setAuthUser();
LogMailer.setAuthPwd();
LogMailer.setSmtpFrom();
LogMailer.setSmtpTo();
LogMailer.setSmtpSubject();

module.exports = {LogMailer};
