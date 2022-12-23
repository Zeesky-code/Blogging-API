const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

require('dotenv').config()

//import authentication middleware
require('./middlewares/auth')

//routes
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const commentRoute = require('./routes/comment.route')

const app = express()

const {connectToMongoDB} = require('./config/db')

connectToMongoDB()

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