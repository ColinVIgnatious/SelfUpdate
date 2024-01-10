const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const { protectTeacher, protectAdmin } = require('../middlewares/auth')

router.get('/categories',protectAdmin, categoryController.getAllCategories)
router.get('/categories-for-teacher', categoryController.getAllCategoriesForTeacher)
router.get('/categories-for-user', categoryController.getAllCategoriesUser)

router.get('/category/:id', categoryController.getCategoryById)
router.post('/category', protectAdmin, categoryController.createCategory)
router.patch('/category/:id', protectAdmin, categoryController.updateCategory)
router.delete('/category/:id', protectAdmin, categoryController.deleteCategory)
router.patch('/change-category-status', protectAdmin, categoryController.changeCategoryStatus)

module.exports = router
