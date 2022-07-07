require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJSWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB()

// custom middleware logger
app.use(logger);

// if CORS sees that response headeris not set, it throws creadentials error 
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false}));    // we put app.use above all routes so it will apply to all 

//built-in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// serves static files !!
app.use('/', express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))   // receive the cookie has the refresh token and that will issue a new access token once the access token has expired
app.use('/logout', require('./routes/logout'))

app.use(verifyJSWT)       // waterfall under this line requires to be verifeid to reach
app.use('/employees', require('./routes/api/employees'))
app.use('/users', require('./routes/api/users'))

// handle 404 with status 404 send. otherwise it would be send just 200 as if founded page.
// app.all will apply to all http methods but it doesn't accept regEx. so instead of '/*' we use '*' at the end of all
// it will catch anything made it through here 
app.all('*', (req, res) => {
    res.status(404)
    if ( req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if ( req.accepts('json')) {
        res.json({ error: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
    
})

// custom error handler
app.use(errorHandler)


// we don't want to listen if we don't connect
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server runing on port ${PORT}`))
})
