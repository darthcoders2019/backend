const mrq = require('mongoose-rest-query'),
    async = require('async'),
        bcrypt = require('bcrypt-nodejs'),
        jwt = require('../utils/jwt'),
        https = require('https'),
        request = require('request-promise'),
        config = require('../app.config');

module.exports = function () {

    return {
        getPost: getPost,
        create: create
    };

    function getPost(req, res) {

        const Post = mrq.model(req, 'Post');
        const lat = req.query.lat;
        const lng = req.query.lng;
        let postByDistance = [];

        Post.find()
            .lean()
            .sort()
            .populate('user_id')
            .exec(function (err, posts) {
                if (lat) {
                    posts.forEach(post => {
                        var d = calcCrow(lat, lng, post.user_id.lat, post.user_id.lng);

                        if (d < 20)
                            postByDistance.push(post);
                    });
                } else
                    postByDistance = posts;

                postByDistance.sort(function (a, b) {
                    return new Date(b.post_date) - new Date(a.post_date);
                });

                res.status(200).send(postByDistance)
            });

        function calcCrow(lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = toRad(lat2 - lat1);
            var dLon = toRad(lon2 - lon1);
            var lat1 = toRad(lat1);
            var lat2 = toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }

        function toRad(Value) {
            return Value * Math.PI / 180;
        }

    }

    function create(req, res) {
        const User = mrq.model(req, 'User');

        const Post = mrq.model(req, 'Post');

        Post.create(req.body, function (err, data) {
            if (err)
                res.status(500).send(err);
            else {
                let currentUser = User.findById(req.body.user_id)
                    .exec(function (err, currentUser) {
                        const lat = currentUser.lat;
                        const lng = currentUser.lng;

                        User.find()
                            .lean()
                            .exec(function (err, users) {
                                users.forEach(user => {
                                    if (user._id != currentUser._id) {
                                        var d = calcCrow(lat, lng, user.lat, user.lng);

                                        if (d < 20) {
                                            const options = {
                                                method: 'POST',
                                                uri: 'https://fcm.googleapis.com/fcm/send',
                                                body: {
                                                    "notification": {
                                                        "title": "New Posts",
                                                        "body": user,
                                                        "sound": "default"
                                                    },
                                                    "to": user.fcmToken || "test"
                                                },
                                                json: true,
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': config.cloud_messaging_key
                                                }
                                            }

                                            request(options).then(function (response) {
                                                // res.status(200).json(response);
                                            })
                                        }
                                    }
                                });

                                res.status(200).json(data);
                            });


                        function calcCrow(lat1, lon1, lat2, lon2) {
                            var R = 6371; // km
                            var dLat = toRad(lat2 - lat1);
                            var dLon = toRad(lon2 - lon1);
                            var lat1 = toRad(lat1);
                            var lat2 = toRad(lat2);

                            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            var d = R * c;
                            return d;
                        }

                        function toRad(Value) {
                            return Value * Math.PI / 180;
                        }

                        //callback(err, employee);
                    });

            }

        });

    }


};