// CORS: Cross Origin Resource Sharing 
// cors can be problem for non public apis. so we need whitelist

const allowedOrigins = require('./allowedOrigins')
 
const corsOptions = {
    origin: (origin, callback) => {
        // for development only we have !origin in order to run undefined origin also whitelist should be edited obviously 
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions;