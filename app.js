const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

require('dotenv').config()

//import authentication middleware
require('./middlewares/auth')

//routes
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const commentRoute = require('./routes/comment.route')

const app = express()

//set up db connection
const { connectToMongoDB } = require('./config/db')
connectToMongoDB()

//set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

//defining swagger options
const options = {
    definition: {
        openapi: "3.1.0",
        swagger: "2.0",
        info: {
            title: "Blogging API",
            version: "1.0.0",
            description: "An API for a blog built with Node.js, ExpressJS and MongoDB",
            contact: {
                name: "Zainab Lawal",
                email: "zainablaw1012@gmail.com"
            }

        },
        servers: [
            {
                url: "http://localhost:9000",
                liveurl: "https://wild-pink-sturgeon-cape.cyclic.app/"
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


app.use(passport.initialize());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.use('/comments', commentRoute)

app.get('/', (req, res) => {
    res.status(200).json({
        status: "true",
        message: "Welcome to Blogging API"
    })
})


module.exports = app