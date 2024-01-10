const express = require('express')
const router = express.Router()
const segmentController = require('../controllers/segmentController')
const { protect, protectTeacher, checkUser } = require('../middlewares/auth')

router.post('/create-segment/:chapterId', protectTeacher, segmentController.createSegment)
router.delete('/delete-segment/:segmentId', protectTeacher, segmentController.deleteSegment)

module.exports = router
