const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors.middleware')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

// Import all routes
const products = require('./routes/product.router')
const auth = require('./routes/auth.router')

app.use('/api/v1', products)
app.use('/api/v1', auth)

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app