const Course = require('../models/Course')
const Favorite = require('../models/Wishlist')

module.exports = {
	// Get all favorites
	getFavorites: async (req, res, next) => {
		try {
			const page = Number(req.query.page) || 1
			const limit = Number(req.query.limit) || 2
			let favorites = await Favorite.find({ user: req.user._id })
				.populate('course')
				.sort('-createdAt')
				.skip((page - 1) * limit)
				.limit(limit)
			const total = await Favorite.countDocuments({})
			res.status(200).json({ success: true, favorites, page, total })
		} catch (error) {
			next(error)
		}
	},

	// Create a favorite
	createFavorite: async (req, res, next) => {
		try {
			const {courseId} = req.params
			console.log(courseId)
			const course = await Course.findById(courseId)
			if (!course) return res.status(404).json({ message: 'Course not found' })
			const favorite = await Favorite.findOne({ user: req.user._id, course: courseId })
			if (favorite) return res.status(400).json({ message: 'You have already favorited this course' })
			await Favorite.create({ user: req.user._id, course: courseId })
			res.status(200).json({ success: true, message: 'Course favorited successfully' })
		} catch (error) {
			next(error)
		}
	},

	// Delete a favorite
	deleteFavorite: async (req, res, next) => {
		try {
			const {courseId } = req.params
			console.log(courseId)
			const course = await Course.findById(courseId)
			if (!course) return res.status(404).json({ message: 'Course not found' })
			const favorite = await Favorite.findOne({ user: req.user._id, course: courseId })
			if (!favorite) return res.status(400).json({ message: 'You have not favorited this course' })
			await Favorite.findByIdAndDelete(favorite._id)
			res.status(200).json({ success: true, message: 'Course unfavorited successfully' })
		} catch (error) {
			next(error)
		}
	},
}