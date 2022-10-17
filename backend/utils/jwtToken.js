// Create and send token and save in the cookie
const sendToken = (res, statusCode, user) => {

    // Create JWT Token
    const token = user.getJwtToken()

    // Options for cookie
    const options = {
        maxAge: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
        ),
        httpOnly: true,
        // secure: process.env.NODE_ENV==='DEVELOPMENT' ? false : true
    }

    // Send token
    res
        .cookie('token', token, options)
        .status(statusCode)
        .json({
            success: true,
            user,
            token
        })

}

module.exports = sendToken