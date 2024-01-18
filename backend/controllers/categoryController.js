const Category = require('../models/Category')
const Course = require('../models/Course')

module.exports = {
	// Get all categories
	getAllCategories: async (req, res, next) => {
		try {
			const { page, count, query } = req.query
			const escapedQuery = query?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

			const totalCategories = await Category.countDocuments({
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
			const categories = await Category.find({
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalCategories, categories })
		} catch (error) {
			next(error)
		}
	},

	// Get all categories for teacher
	getAllCategoriesForTeacher: async (req, res, next) => {
		try {
			const categories = await Category.find({ status: 'listed' })
			res.status(200).json({ success: true, categories })
		} catch (error) {
			next(error)
		}
	},

	// Get all categories for User
	getAllCategoriesUser: async (req, res, next) => {
		try {
			const { page, count, query } = req.query
			const escapedQuery = query?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

			const totalCategories = await Category.countDocuments({
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
			const categories = await Category.find({
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalCategories, categories })
		} catch (error) {
			next(error)
		}
	},

	// Get category by id
	getCategoryById: async (req, res, next) => {
		try {
			const category = await Category.findById(req.params.id)
			res.status(200).json({ success: true, category })
		} catch (error) {
			next(error)
		}
	},

	// Create new category
	createCategory: async (req, res, next) => {
		try {
			const { title, description, status } = req.body
			// Check if a category with the same title already exists
			const existingCategory = await Category.findOne({ title: { $regex: `^${title}$`, $options: 'i' } });

			if (existingCategory) {
				return res.status(400).json({ success: false, message: 'Category with the same title already exists.' });
			}
			const category = await Category.create({ title, description, status })
			res.status(200).json({ success: true, category })
		} catch (error) {
			next(error)
		}
	},

	// Update category
	updateCategory: async (req, res, next) => {
		try {
			const { title, description, status } = req.body
			const category = await Category.findByIdAndUpdate(
				req.params.id,
				{ title, description, status },
				{ new: true }
			)
			res.status(200).json({ success: true, category })
		} catch (error) {
			next(error)
		}
	},

	// Delete category
	deleteCategory: async (req, res, next) => {
		try {
			const category = await Category.findById(req.params.id)
			if (!category) return res.status(404).json({ success: false, message: 'Category not found' })
			const courses = await Course.countDocuments({ category: category._id })
			if (courses > 0)
				return res.status(400).json({ success: false, message: 'Cannot delete category with courses' })
			await Category.findByIdAndDelete(req.params.id)
			res.status(200).json({ success: true })
		} catch (error) {
			next(error)
		}
	},

	// Change category status
	changeCategoryStatus: async (req, res, next) => {
		try {
			const { id, status } = req.query
			const category = await Category.findById(id)
			if (!category) res.status(404).json({ success: false, message: 'Category not found' })
			category.status = status
			await category.save()
			res.status(200).json({ success: true, category })
		} catch (error) {
			next(error)
		}
	},

	
}
