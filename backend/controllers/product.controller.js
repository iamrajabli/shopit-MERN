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
    const resPerPage = 9

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


// Create new review    =>   /api/v1/reviews
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body

    const review = {
        rating,
        comment,
        user: req.user._id
    }

    const product = await Product.findById(productId)
    const userReview = product.reviews.find(review => review.user.toString() === req.user._id.toString())

    if (userReview) {
        userReview.comment = comment
        userReview.rating = rating

    } else {
        product.reviews.push(review)
        numOfReviews = product.reviews.length
    }

    // Calc new rating
    let totalRating = 0
    product.reviews.forEach(review => totalRating += review.rating)
    product.ratings = totalRating


    await product.save({ validateBeforeSave: false })


    res.status(200).json({
        success: true
    })
})


// Get Product Reviews      =>      /api/v1/reviews
exports.getProductsReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }


    res.status(200).json({
        success: true,
        ratings: product.ratings,
        reviews: product.reviews
    })
})


exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(review => review._id != req.query.id)

    // Calc new rating
    let totalRating = 0
    reviews.forEach(review => totalRating += review.rating)

    await Product.findByIdAndUpdate(req.query.productId, {
        $set: {
            reviews,
            numOfReviews: reviews.length,
            ratings: totalRating
        }
    })


    res.status(200).json({
        success: true
    })

})