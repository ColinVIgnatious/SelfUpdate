const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

router.get('/reviews/:id', reviewController.getReviews)
router.post('/reviews/:id', protect, reviewController.createReview)

module.exports = router
