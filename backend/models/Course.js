const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		// required: [true, 'Please Enter Course Name'],
		trim: true,
	},
	description: {
		type: String,
		// required: [true, 'Please Enter Course Description'],
		trim: true,
	},
	price: {
		type: Number,
		// required: [true, 'Please Enter Course Price'],
		trim: true,
	},
	mrp: {
		type: Number,
		// required: [true, 'Please Enter Course MRP'],
		trim: true,
	},
	duration: {
		type: String,
		trim: true,
	},
	thumbnail: {
		type: String,
		// required: [true, 'Please Enter Course Image'],
		trim: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		// required: true,
	},
	level: {
		type: String,
		enum: ['Beginner', 'Intermediate', 'Advanced'],
		// required: true,
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		// required: true,
	},
	chapters: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chapter',
		},
	],
	status: {
		type: String,
		enum: ['Draft', 'Published','Pending Approval','Rejected'],
		default: 'Pending Approval',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

// courseSchema.pre('save', function (next) {
// 	this.duration = this.chapters.reduce((total, chapter) => {
// 		chapter.segments.forEach((segment) => (total += segment.duration))
// 		return total
// 	}, 0)
// 	next()
// })

module.exports = mongoose.model('Course', courseSchema)
