const Product = require('../models/product.model')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware')
const APIFeatures = require('../utils/apiFeatures')


// Create new product   =>  /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})


// Get all products    =>  /api/v1/products?keyword=text
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 3

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .page(resPerPage)


    const products = await apiFeatures.query

    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
})


// Get single product details   =>  /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})


// Update product   =>   /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body }
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
})


// Delete product   =>    /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
})
