const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const rateLimit = require('express-rate-limit')

require('dotenv').config()

//import authentication middleware
require('./middlewares/auth')

//routes
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const commentRoute = require('./routes/comment.route')

const app = express()

//set up db connection
const {connectToMongoDB} = require('./config/db')
connectToMongoDB()

//set up rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(passport.initialize());

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))





app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.use('/comments', commentRoute)

app.get('/', (req,res)=>{
    res.status(200).json({
        status: "true",
        message: "Welcome to Blogging API"
    })
})


module.exports = app