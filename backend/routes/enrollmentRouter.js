const express = require('express')
const router = express.Router()
const enrollmentController = require('../controllers/enrollmentController.js')
const { protect } = require('../middlewares/auth.js')

router.get('/enrollment/:id', protect, enrollmentController.getEnrollment)
// router.post('/enrollment/:id', protect, enrollmentController.createEnrollment)
router.post('/enrollment/:courseId', protect, enrollmentController.markAsComplete)
router.get('/sales-history', enrollmentController.getSalesHistory) //admin
router.get('/enrollment-history', enrollmentController.getEnrollmentHistory) //teacher

module.exports = router