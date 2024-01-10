const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapterController')
const { protect, protectTeacher, checkUser } = require('../middlewares/auth')

router.post('/create-chapter/:courseId', protectTeacher, chapterController.createChapter)
router.delete('/delete-chapter/:chapterId', protectTeacher, chapterController.deleteChapter)
module.exports = router
