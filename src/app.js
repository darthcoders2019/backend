const express = require('express'),
    mrq = require('mongoose-rest-query'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    app = express(),
    helmet = require('helmet'),
    package = require('../package.json'),
    restify = mrq.restify,
    passport = require('passport'),
    config = require('./app.config'),
    multer = require("multer"),
    cloudinary = require("cloudinary"),
    cloudinaryStorage = require("multer-storage-cloudinary");

let middleware = require('./middleware');

mrq.config.modelSchemas = config.SCHEMAS;
mrq.config.dbPath = config.DB_PATH;
require('./utils/auth')(passport);
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));

app.use(mrq.db);
app.use(passport.initialize());
app.use(middleware.cors);

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "darthCoders",
    allowedFormats: ["jpg", "png"],
    transformation: [{
        width: 500,
        height: 500,
        crop: "limit"
    }]
});

const parser = multer({
    storage: storage
});

//public route

// app.use('/', (req, res) => {
//     res.send('Welcome to the service');
// });

app.use('/version', (req, res) => {
    res.send(package.version);
});

app.use('/api/public/auth', require('./route/authRoute')());

app.post('/api/public/images', parser.single("image"), (req, res) => {
    res.send(req.file);
});

app.use('/api/public/posts', restify('Post'));


//app.use(middleware.auth);

app.use('/api/private/users', restify('User'));

// app.use('api/upload', require('./route/uploadRoute')());

app.listen(config.PORT, () => {
    console.log('Service is listening on port', config.PORT);
});