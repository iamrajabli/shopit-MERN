const express = require('express')
const router = express.Router()

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct } = require('../controllers/product.controller')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth.middleware')


router.get('/products', isAuthenticatedUser, getProducts)

router.get('/product/:id', getSingleProduct)

router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), newProduct)

router.put('/admin/product/edit/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct)

router.delete('/admin/product/remove/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)


module.exports = router