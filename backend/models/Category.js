const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please Enter Category Title'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Please Enter Category Description'],
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['listed', 'unlisted'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Category', categorySchema)
