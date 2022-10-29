const app = require('./app')

const PORT = 9000 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})