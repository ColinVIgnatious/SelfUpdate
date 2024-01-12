const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect, protectTeacher, protectAdmin } = require('../middlewares/auth')
const upload = require('../config/multer')

// router.get('/', protect, userController.home)
router.patch('/profile', protect, upload.single('image'), userController.updateUserProfile)
router.post('/login', userController.login)
router.post('/social-login', userController.socialLogin)
router.post('/send-otp', userController.sendOtp)
router.post('/signup', userController.signup)
router.get('/logout', userController.logoutUser)
router.post('/forgotsend-otp', userController.forgotsendOtp)
router.post('/forgotpassword', userController.forgotpassword)

router.get('/get-users-teacher', protectTeacher, userController.getUsersOfTeacher) //teacher
router.get('/getanalyticsteacher', protectTeacher, userController.getAllAnalyticsTeacher) //teacher

router.get('/all-users', protectAdmin, userController.getAllUsers) //admin
router.get('/all-teachers', protectAdmin, userController.getAllTeachers) //admin
router.get('/getanalyticsadmin', protectAdmin, userController.getAllAnalyticsAdmin) //admin
router.patch('/change-status', protectAdmin, userController.changeUserStatus) //admin

module.exports = router
