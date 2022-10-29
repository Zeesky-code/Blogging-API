const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

require('dotenv').config()

//import authentication middleware
require('./middlewares/auth')

//routes
const userRoute = require('./routes/users')


const app = express()

const {connectToMongoDB} = require('./config/db')

connectToMongoDB()

app.use(passport.initialize());

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use(passport.initialize());


app.use('/user', userRoute)

app.get('/', (req,res)=>{
    res.status(200).send("Welcome to Blogging API")
})


module.exports = app