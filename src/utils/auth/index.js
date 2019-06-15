const passport = require('passport'),
    facebook_config = require('../../app.config').facebook,
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (req, res) {

    passport.use(new FacebookStrategy({
            clientID: facebook_config.app_id,
            clientSecret: facebook_config.app_secret,
            callbackURL: facebook_config.callback
        },
        function (accessToken, refreshToken, profile, done) {
            console.log("profile", req);

            /*User.findOne({ email: profile.emails[0].value }, function (err, user) {
                if (err) { return done(err) }
                if (!user) {
                    user = new User({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value,
                        providers: {
                            facebook: {
                                id: profile.id,
                                access_token: accessTOken,
                                display_name: displayName,
                                picture: "http://graph.facebook.com/"+profile.id+"/picture?type=square"
                            }
                        }
                    })
                    user.save(function (err) {
                        if (err) console.log(err)
                        return done(err, user)
                    })
                }
                else {
                    return done(err, user)
                }
            })*/
        }
    ));
};