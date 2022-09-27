const mongoose = require('mongoose')

module.exports = () => {
    try {
        mongoose.connect(process.env.DB_LOCAL_URI)
        console.log('MongoDB Database connected!')

    } catch (error) {
        console.log('Something went error in DB!', error);
    }
}