const express = require('express')
require('dotenv').config()

const PORT = 9000;
const app = express()

const {connectToMongoDB} = require('./config/db')

connectToMongoDB()

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})