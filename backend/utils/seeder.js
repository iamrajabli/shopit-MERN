const Product = require('../models/product.model')
const dotenv = require('dotenv')
const connectDatabase = require('../config/database')
const products = require('../data/products.json')


// Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase()

const seedProduct = async () => {

    try {
        
        await Product.deleteMany()
        console.log('Products are deleted')

        await Product.insertMany(products)
        console.log('All Products added')

        process.exit()

    } catch (error) {
        console.log(error)
        process.exit()
    }
    
}

seedProduct()