const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')
const { protect, protectTeacher, checkUser } = require('../middlewares/auth')
const upload = require('../config/multer')

router.get('/courses',checkUser, courseController.getCourses) //public
router.get('/search',checkUser, courseController.getSearchCourses) //public
router.get('/course/:id', courseController.getCourseByID) //public

router.get('/get-stripe-intent', courseController.getStripeIntent) //user
router.post('/create-checkout-session', protect, courseController.createCheckoutSession) //user
router.get('/my-courses', protect, courseController.getEnrolledCourses) //user
router.get('/wishlisted-courses', protect, courseController.getWishlistedCourses) //user
router.get('/categorised-courses', protect,courseController.getCategorisedCourses) //user

router.get('/teacher/courses', protectTeacher, courseController.getCoursesByTeacher) //teacher
router.get('/all-courses-by-teacher', protectTeacher, courseController.getCoursesByTeacher) //teacher
router.delete('/delete-course/:id', protectTeacher, courseController.deleteCourse) //teacher
router.post('/create-course', protectTeacher, upload.single('thumbnail'), courseController.createCourse) //teacher
router.get('/get-upload-url', courseController.createMuxUploadUrl) //teacher
router.post('/course/:id/thumbnail',upload.single('thumbnail'), courseController.updateCourseImage) //teacher
router.patch('/update-course/:id', protectTeacher, upload.single('thumbnail'), courseController.updateCourse) //teacher

router.get('/all-courses', courseController.getAllCourses) //admin
router.get('/pending-courses', courseController.getPendingCourses) //admin
router.get('/pending-courses-details', courseController.getPendingCoursesDetails) //admin
router.patch('/change-course-status', courseController.changeCourseStatus) //admin
router.patch('/reject-course', courseController.rejectCourse) //admin

module.exports = router
