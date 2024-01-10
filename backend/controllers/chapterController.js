const Chapter = require('../models/Chapter')
const Course = require('../models/Course')

module.exports = {
	// Get all chapters
	getAllChapters: async (req, res, next) => {
		try {
			const chapters = await Chapter.find()
			res.status(200).json({ success: true, chapters })
		} catch (error) {
			next(error)
		}
	},

	// Create new chapter
	createChapter: async (req, res, next) => {
		try {
			const { title, description } = req.body
			const { courseId } = req.params
			const course = await Course.findById(courseId)
			if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
			if (!course.teacher.equals(req.user.id))
				return res.status(403).json({ success: false, message: 'You cannot modify this course' })
			const chapter = await Chapter.create({ title, description, course: courseId })
			course.chapters.push(chapter._id)
			course.save()
			res.status(200).json({ success: true, chapter })
		} catch (error) {
			next(error)
		}
	},

	deleteChapter: async (req, res, next) => {
		try {
			const { chapterId } = req.params
			const chapter = await Chapter.findById(chapterId)
			if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' })
			const course = await Course.findById('654ce3ed26a367f3c132ab93')
			if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
			if (!course.teacher.equals(req.user.id))
				return res.status(403).json({ success: false, message: 'You cannot modify this course' })
			course.chapters.pull(chapterId)
			await course.save()
			// TODO: delete all videos from mux
			await Chapter.findByIdAndDelete(chapterId)
			res.status(200).json({ success: true, chapter, message: 'Chapter deleted successfully' })
		} catch (error) {
			next(error)
		}
	},
}
