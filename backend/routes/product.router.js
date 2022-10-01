const express = require('express')
const router = express.Router()

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct } = require('../controllers/product.controller')

const { isAuthenticatedUser } = require('../middlewares/auth.middleware')


router.get('/products', getProducts)

router.get('/product/:id', getSingleProduct)

router.post('/admin/product/new', isAuthenticatedUser, newProduct)

router.put('/admin/product/edit/:id', isAuthenticatedUser, updateProduct)

router.delete('/admin/product/remove/:id', isAuthenticatedUser, deleteProduct)


module.exports = router