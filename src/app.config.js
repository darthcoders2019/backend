module.exports = {
    PORT: process.env.PORT || 9060,
    DB_PATH: 'mongodb://adminTashley:codenametashley@ds016138.mlab.com:16138/codenametashley',
    SCHEMAS: require('../schema'),
    jwt: {
        iss: 'darthcoders',
        secretKey: 'dfe6cb38402873719b964ace46c3ac83b8c21c938c7bf46e8efee485a3e5c3bd4e7d2ed109c6c6b4c627510662876da1eda94f856f1abb8748bdbb5d4e44bbc1',
        algorithm: 'HS256',
        durationType: 'days',
        durationShort: 1,
        durationLong: 365
    },
    mailTemplates: {
        welcome: 381403,
        resendActivation: 381445,
        resetPassword: 381490
    },
    mail: {
        api_key: process.env.MAIL_API_KEY || '34abddacd68b2b23e453d55ec8aa310d',
        api_secret: process.env.MAIL_API_SECRET || 'd3aee2b401e906c4a7bbf295ad20d8fd',
        email: process.env.FROM_EMAIL || 'brendonemile7@gmail.com',
        name: 'DarthCoders'
    },
    facebook: {
        app_id: "445281516310886",
        app_secret: "61fd03fae23d92c0225bf66d83a47545",
        callback: "http://localhost:9060/api/auth/facebook/callback"
    }
}