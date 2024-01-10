const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
	chat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Chat',
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	content: {
		type: String,
	},
	reaction: {
		type: String,
	},
	attachment: {
		type: String,
        required: function () {
            return this.attachmentType !== 'text'
        }
	},
	attachmentType: {
		type: String,
		enum: ['text', 'image', 'video', 'audio', 'document'],
        default: 'text',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('ChatMessage', chatMessageSchema)