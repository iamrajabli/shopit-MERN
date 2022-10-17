const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors.middleware')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())


// Import all routes
const products = require('./routes/product.router')
const auth = require('./routes/auth.router')
const order = require('./routes/order.router')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app