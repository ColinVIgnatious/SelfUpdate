const mongoose = require('mongoose')
const chapterSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please Enter Chapter Title'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	segments: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Segment',
		},
	],
	course: {
		type: mongoose.Schema.ObjectId,
		ref: 'Course',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Chapter', chapterSchema)
