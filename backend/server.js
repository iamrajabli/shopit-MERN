const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

// Setting up config file
dotenv.config({ path: 'backend/config/config.env' })

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down due to uncaught exception')
    process.exit(1)
})

// Connection to database
connectDatabase()

// Server listening
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down the server due to Unhandled Promise rejection')
    server.close(() => {
        process.exit(1)
    })
})