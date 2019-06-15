const express = require('express'),
    passport = require('passport');

module.exports = function () {

    var authController = require('../controller/authController')();

    var route = express.Router();

    route.route('/login')
        .post(authController.login);

    route.route('/register')
        .post(authController.register);

    route.get('/facebook', passport.authenticate('facebook'), function (req, res) {});

    route.get('/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log(res);

            res.redirect('/');
        });

    return route;
};