const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	course: {
		type: mongoose.Schema.ObjectId,
		ref: 'Course',
		required: true,
	},
	rating: {
		type: Number,
		required: [true, 'Please Add Rating'],
		min: 1,
		max: 5,
	},
	subject: {
		type: String,
		required: [true, 'Please Add Subject'],
	},
	comment: {
		type: String,
		required: [true, 'Please Add Comment'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Review', reviewSchema)
