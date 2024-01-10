const Review = require('../models/Review')
const Course = require('../models/Course')

module.exports = {
	getReviews: async (req, res, next) => {
		try {
            const { id: courseId } = req.params
            const { page, limit } = req.query
            const course = await Course.countDocuments({ _id: courseId })
            if (!course) return res.status(404).json({ message: 'Course not found' })
            const reviews = await Review.find({ course: courseId })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
			res.status(200).json({ success: true, reviews })
		} catch (error) {
			next(error)
		}
	},
	createReview: async (req, res, next) => {
		try {
			const { id: courseId } = req.params
			const { subject, rating, comment } = req.body
			const course = await Course.countDocuments({ _id: courseId })
			if (!course) return res.status(404).json({ message: 'Course not found' })
			const review = await Review.create({ subject, comment, rating, course: courseId })
			res.status(201).json({ success: true, review })
		} catch (error) {
			next(error)
		}
	},
}
