const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { protectAdmin } = require('../middlewares/auth')
const upload = require('../config/multer')

router.get('/users', protectAdmin, adminController.getUsers)
router.post('/login', adminController.login)
router.get('/logout', adminController.logoutUser)
router.put('/update-user', protectAdmin, upload.single('image'), adminController.updateUser)
router.post('/add-user', protectAdmin, upload.single('image'), adminController.createUser)
router.delete('/delete-user', protectAdmin, adminController.deleteUser)

module.exports = router
