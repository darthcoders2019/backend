const express = require('express'),
    passport = require('passport');

module.exports = function () {

    var authController = require('../controller/authController')();

    var route = express.Router();

    route.route('/login')
        .post(authController.login);

    route.route('/register')
        .post(authController.register);

    return route;
};