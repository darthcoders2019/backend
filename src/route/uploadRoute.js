const express = require('express'),
    passport = require('passport');

module.exports = function () {

    var uploadController = require('../controller/uploadController')();

    var route = express.Router();

    route.route('/image')
        .post(uploadController.upload);

    return route;
};