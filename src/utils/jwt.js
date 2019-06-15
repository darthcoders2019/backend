let moment = require('moment'),
    JWT = require('jwt-async'),
    config = require('../app.config').jwt;

module.exports = function () {

    let options = {
        crypto: {
            algorithm: config.algorithm,
            secret: config.secretKey
        }
    };

    let jwt = new JWT(options);

    return {
        generate: generate,
        isValid: isValid,
        decode: decode
    };

    function generate(data, duration, callback) {

        let payload = {
            iss: config.iss,
            exp: moment().add(duration, config.durationType),
            data: data
        };

        jwt.sign(payload, callback);
    }

    function isValid(payload) {

        let expiryDate = new Date(payload.exp);
        let currentDate = moment()._d;

        return (currentDate < expiryDate);
    }

    function decode(token, callback) {
        jwt.verify(token, callback);
    }

}();