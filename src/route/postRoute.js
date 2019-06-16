const express = require('express');

module.exports = function () {

    var postController = require('../controller/postController')();

    var route = express.Router();

    route.route('/')
        .get(postController.getPost);

    route.route('/')
        .post(postController.create);

    return route;
};