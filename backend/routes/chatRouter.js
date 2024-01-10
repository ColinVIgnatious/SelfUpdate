const express = require('express')
const router = express.Router()

const chatController = require('../controllers/chatController.js')
const { protect, protectTeacher, checkUser } = require('../middlewares/auth')
const upload = require('../config/multer')

//==================USER PROTECTED ROUTES==================//
router.get('/get-chats', protect, chatController.getChats)
router.get('/teacher/get-chats', protectTeacher, chatController.getChats)

router.get('/get-chat/:chatId', chatController.getChat)
router.post('/create-chat', protect, chatController.createChat)
router.post('/teacher/create-chat', protectTeacher, chatController.createChat)
router.post('/create-chat-message/:chatId', protect, upload.single('attachment'), chatController.createChatMessage)
router.post('/teacher/create-chat-message/:chatId', protectTeacher, upload.single('attachment'), chatController.createChatMessage)
router.post('/mark-chat-read/:chatId', protect, chatController.markChatRead)
router.post('/teacher/mark-chat-read/:chatId', protectTeacher, chatController.markChatRead)
router.get('/get-messages/:chatId', chatController.getMessages)
router.get('/teacher/get-messages/:chatId', protectTeacher, chatController.getMessages)
router.post('/makereaction/:chatId', protect, chatController.makeReaction)
router.post('/teacher/makereaction/:chatId', protectTeacher, chatController.makeReaction)

module.exports = router