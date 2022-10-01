// Create and send token and save in the cookie
const sendToken = (res, statusCode, user) => {

    // Create JWT Token
    const token = user.getJwtToken()

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
        ),
        httpOnly: true
    }

    // Send token
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user,
            token
        })

}

module.exports = sendToken