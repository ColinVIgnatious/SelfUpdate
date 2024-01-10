const mongoose = require('mongoose')
const enrollmentsSchema = new mongoose.Schema({
	course: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
	progress: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Segment',
		},
	],
	purchasedAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Enrollment', enrollmentsSchema)
