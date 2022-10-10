const User = require('../models/user.model')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')

// Register a user      =>  /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const { name, email, password } = req.body

    console.log(name, email, password);

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    // Send token
    sendToken(res, 200, user)
})

// Login User     =>    /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // Send token
    sendToken(res, 200, user)
})

// Forgot password /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex')

    await User.findByIdAndUpdate(user._id, {
        $set: {
            // Hash and set to resetPasswordToken
            resetPasswordToken: crypto.createHash('sha256').update(resetToken).digest('hex'),

            // Set token expire time
            resetPasswordExpire: Date.now() + 1000 * 60 * 30
        }
    })

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sen to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        return next(new ErrorHandler(error.message, 500))
    }
})


// Reset password /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(res, 200, user)
})


exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        user
    })

})

// UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user._id).select('+password')

    // OLD PASS CONTROL
    const isPasswordMatchedForOldPassword = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatchedForOldPassword) {
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    // NEW PASS CONTROL
    const isPasswordMatchedForNewPassword = await user.comparePassword(req.body.newPassword)

    if (isPasswordMatchedForNewPassword) {
        return next(new ErrorHandler('The new password cannot be the same as the old password', 400))
    }

    // PASS UPDATE
    user.password = req.body.newPassword
    await user.save()

    sendToken(res, 200, user)

})

// UPDATE PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const { name, email } = req.body

    // VALIDATE EMPTY
    if (!name || !email) {
        return next(new ErrorHandler(`All ares are required`))
    }
    const newUserData = { name, email }

    // PASSWORD CONTROL
    const user = await User.findById(req.user._id).select('+password')

    const isPasswordMatched = await user.comparePassword(req.body.password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Password is incorrect', 400))
    }

    // IF PASSWORD IS CORRECT - UPDATE DATA
    await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true
    })

})


exports.allUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })


})
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })


})


exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, role } = req.body

    // VALIDATE EMPTY
    if (!name || !email || !role) {
        return next(new ErrorHandler(`All ares are required`))
    }

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    const newUserData = { name, email, role }

    // ADMIN PASSWORD CONTROL
    const admin = await User.findById(req.user._id).select('+password')

    const isPasswordMatched = await admin.comparePassword(req.body.password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Password is incorrect', 400))
    }

    // IF PASSWORD IS CORRECT - UPDATE USER DATA
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true
    })
})


exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    if (!req.body.password) {
        return next(new ErrorHandler(`Password is required!`))
    }

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // ADMIN PASSWORD CONTROL
    const admin = await User.findById(req.user._id).select('+password')

    const isPasswordMatched = await admin.comparePassword(req.body.password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Password is incorrect', 400))
    }

    await user.remove()

    res.status(200).json({
        success: true
    })
})



// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})