var jwt = require('../utils/jwt');
var mrq = require('mongoose-rest-query');

module.exports = function (req, res, next) {

    var User = mrq.model(req, 'User');
    var token = req.headers.authorization;

    if (token) {

        var authToken = token.split(' ')[1];

        jwt.decode(authToken, function (err, data) {

            var payload = data.claims;

            if (jwt.isValid(payload)) {

                User.findById(payload.data.id, function (err, user) {

                    if (user && user.isActive) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).send('UnAuthorised');
                    }

                });
            } else {
                res.status(401).send({
                    Error: 'Token expired'
                });
            }

        });


    } else {
        res.status(401).send({
            Error: 'No token provided'
        });
    }
};