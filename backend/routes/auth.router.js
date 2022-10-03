
const express = require('express')
const router = express.Router()

const { registerUser, loginUser, forgotPassword, resetPassword, logout } = require('../controllers/auth.controller')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/password/forgot', forgotPassword)
router.put('/password/reset/:token', resetPassword)
router.post('/logout', logout)


module.exports = router