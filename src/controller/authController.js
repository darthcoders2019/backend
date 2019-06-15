const mrq = require('mongoose-rest-query'),
    async = require('async'),
        bcrypt = require('bcrypt-nodejs'),
        jwt = require('../utils/jwt'),
        config = require('../app.config');

module.exports = function () {

    return {
        login: login,
        register: register
    };

    function login(req, res) {

        var User = mrq.model(req, 'User');
        var email = req.body.email;

        function findUser(callback) {

            User
                .findOne({
                    email: email
                })
                .select('email password isActive')
                .exec(function (err, user) {
                    result = {};
                    result.user = user;
                    callback(err, result);
                });

        }

        function checkUserPassword(result, callback) {

            bcrypt.compare(req.body.password, result.user.password, function (err, value) {
                if (value)
                    callback(err, result);
                else
                    callback(new Error('Invalid Email or Password'));
            });

        }

        function updateLastLogin(result, callback) {

            User.update({
                _id: result.user.id
            }, {
                'lastlogin': new Date()
            }, function (err, data) {
                callback(err, result);
            });
        }

        function generateJWT(result, callback) {

            var data = {
                id: result.user.id,
                email: result.user.email
            };

            jwt.generate(data, config.jwt.durationLong, function (err, data) {
                callback(null, {
                    token: data
                });
            });
        }

        async.waterfall([findUser, checkUserPassword, updateLastLogin, generateJWT], function (err, result) {

            if (err)
                res.status(401).send(err.toString());
            else
                res.send(result);

        });
    }

    function register(req, res) {

        var User = mrq.model(req, 'User');

        function verifyIfEmailAvailable(callback) {

            User.findOne({
                email: req.body.email
            }, function (err, user) {

                if (user) {
                    var error = new Error('EmailNotAvailable');
                    error.name = 'Email not available';
                    error.httpStatusCode = 409;

                    callback(error, null);
                } else
                    callback(null, {});
            });

        }

        function createUser(result, callback) {

            var user = {
                email: req.body.email,
                password: req.body.password,
                fullname: req.body.fullname,
                lat: req.body.lat,
                lng: req.body.lng

            };

            User.create(user, function (err, data) {
                callback(err, result);
            });
        }

        async.waterfall([verifyIfEmailAvailable, createUser], function (err, result) {

            if (err) {
                if (err.httpStatusCode == 409)
                    res.status(err.httpStatusCode).send(err);
                else
                    res.status(500).send(err);
            } else {
                res.status(200).send("Member register successfully");
            }

        });
    }
};