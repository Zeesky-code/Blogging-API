const { createLogger, format, transports } = require('winston');
require('dotenv').config()

const DB_URI = process.env.MONGO_DB_CONNECTION_URI
// Import mongodb
require('winston-mongodb');

module.exports = createLogger({
    transports: [

        // MongoDB transport
        new transports.MongoDB({
            level: 'info',
            //mongo database connection link
            db: DB_URI,
            options: {
                useUnifiedTopology: true
            },
            // A collection to save json formatted logs
            collection: 'server_log',
            format: format.combine(
                format.timestamp(),
                // Convert logs to a json format
                format.json())
        }).on('error', (error) => {
            console.error('MongoDB transport error:', error);
        }),
        new transports.Console()
    ]
});