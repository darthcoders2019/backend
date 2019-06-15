const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    sanitizeJson = require('mongoose-sanitize-json'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    lastlogin: {
        type: Date,
        default: new Date()
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

userSchema.plugin(sanitizeJson);

userSchema.pre('save', function (next, body) {

    var user = this;

    if (user.password || user.isNew) {
        bcrypt.hash(user.password, null, null, function (err, hash) {
            if (err)
                next(err);
            else {
                user.password = hash;
                next();
            }
        });
    } else
        next();

});

module.exports = userSchema;