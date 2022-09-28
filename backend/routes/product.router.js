const express = require('express')
const router = express.Router()

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct } = require('../controllers/product.controller')

router.get('/products', getProducts)

router.get('/product/:id', getSingleProduct)

router.post('/admin/product/new', newProduct)

router.put('/admin/product/edit/:id', updateProduct)

router.delete('/admin/product/remove/:id', deleteProduct)


module.exports = router