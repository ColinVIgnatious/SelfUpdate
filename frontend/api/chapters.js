import axios from 'axios'

export function createChapter({ title, description, courseId }) {
	return axios.post(`/api/create-chapter/${courseId}`, { title, description }).then((res) => res.data.chapter)
}

export function deleteChapter(chapterId) {
    return axios.delete(`/api/delete-chapter/${chapterId}`).then((res) => res.data.chapter)
}
