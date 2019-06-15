var config = require('../app.config'),
    mailjet = require('node-mailjet').connect(config.mail.api_key, config.mail.api_secret);

module.exports = function () {

    return {
        sendmail: sendmail
    };

    function sendmail(recipient, templateID, data, cb) {

        var emailData = {
            Messages: [{
                From: {
                    Email: config.mail.email,
                    Name: config.mail.name
                },
                To: [{
                    Email: recipient
                }],
                TemplateID: templateID,
                TemplateLanguage: true,
                Variables: data
            }]
        };

        mailjet
            .post('send', {
                version: 'v3.1'
            })
            .request(emailData)
            .then(function (result) {
                cb(null, result);
            }).catch(function (err) {
                cb(err);
            })
    }

}();