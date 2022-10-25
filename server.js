const express = require('express')
require('dotenv').config()

const PORT = 9000;
const app = express()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})