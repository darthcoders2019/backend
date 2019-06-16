const mongoose = require('mongoose'),
    sanitizeJson = require('mongoose-sanitize-json'),
    Schema = mongoose.Schema;

var now = new Date();

const postSchema = new Schema({
    image_url: {
        type: String
    },
    image_name: {
        type: String
    },
    description: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [],
    post_date: {
        type: Date,
        default: new Date(new Date().setFullYear(2024))
    },
    likes: {
        type: Number,
        default: 0
    }
});

postSchema.plugin(sanitizeJson);

// userSchema.pre('save', function (next, body) {

//     var user = this;

//     if (user.password || user.isNew) {
//         bcrypt.hash(user.password, null, null, function (err, hash) {
//             if (err)
//                 next(err);
//             else {
//                 user.password = hash;
//                 next();
//             }
//         });
//     } else
//         next();

// });

module.exports = postSchema;