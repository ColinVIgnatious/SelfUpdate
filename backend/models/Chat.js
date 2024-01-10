const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	participants: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			unreadCount: { type: Number, default: 0 },
		},
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			unreadCount: { type: Number, default: 0 },
		},
	],
	lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ChatMessage',
	},
	createdAt: {
		type: Date,
		default: Date.now,
        select: false,
	},
})

module.exports = mongoose.model('Chat', chatSchema)