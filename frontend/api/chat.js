import axios from 'axios'

export function getChatsUser({ limit, page }) {
	return axios
		.get(`/api/get-chats?page=${page}&limit=${limit}`)
		.then((res) => res.data.chats)
		.catch((err) => {
			throw err
		})
}

export function getChatsTeacher({ limit, page }) {
	return axios
		.get(`/api/teacher/get-chats?page=${page}&limit=${limit}`)
		.then((res) => res.data.chats)
		.catch((err) => {
			throw err
		})
}

export function createChat({ receiver }) {
	return axios
		.post(`/api/create-chat`, { receiver })
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}

export function getChat(chatId) {
	return axios
		.get(`/api/get-chat/${chatId}`)
		.then((res) => res.data.chat)
		.catch((err) => {
			throw err
		})
}


export function getMessages({ chatId, page, limit }) {
	return axios
		.get(`/api/get-messages/${chatId}?page=${page}&limit=${limit}`)
		.then((res) => res.data.chatMessages)
		.catch((err) => {
			throw err
		})
}

export function createChatMessage({ role, chatId, content, attachment = null, attachmentType = 'text' }) {
	const formData = new FormData()
	formData.append('content', content)
	formData.append('attachment', attachment)
	formData.append('attachmentType', attachmentType)
	const route =
		role === 'teacher' ? `/api/teacher/create-chat-message/${chatId}` : `/api/create-chat-message/${chatId}`
	return axios
		.post(route, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data.chatMessage)
		.catch((err) => {
			throw err
		})
}

export function markChatRead({ role, chatId, participantId }) {
	const route = role === 'teacher' ? `/api/teacher/mark-chat-read/${chatId}` : `/api/mark-chat-read/${chatId}`
	return axios
		.post(route, { participantId })
		.then((res) => res.data.chat)
		.catch((err) => {
			throw err
		})
}

export function makeReaction({ role, chatId, id,item }) {
	const route = role === 'teacher' ? `/api/teacher/makeReaction/${chatId}` : `/api/makeReaction/${chatId}`
	return axios
		.post(route, { id,item })
		.then((res) => res.data.chat)
		.catch((err) => {
			throw err
		})
}
