const express = require('express')
const router = express.Router()
const wishlistController = require('../controllers/wishlistController')
const { protect, checkUser } = require('../middlewares/auth')

router.get('/favourites', protect, wishlistController.getFavorites)
router.post('/create-favorites/:courseId', protect, wishlistController.createFavorite)
router.delete('/delete-favorites/:courseId', protect, wishlistController.deleteFavorite)
module.exports = router



