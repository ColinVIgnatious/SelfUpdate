import axios from 'axios'
export function getCourses(count, type) {
	return axios.get(`/api/courses?count=${count}&type=${type}`).then((res) => res.data)
}
export function getSearchCourses({count,search}) {
	console.log(search)
	return axios.get(`/api/search?search=${search}&count=${count}`).then((res) => res.data)
}

export function getPendingCourses({ page, count, query }) {
	return axios.get(`/api/pending-courses?page=${page}&count=${count}&query=${query}`).then((res) => res.data)
}

export function getPendingCoursesDetails( courseId ) {
	return axios.get(`/api/pending-courses-details?courseId=${courseId}`).then((res) => res.data)
}

export function getCategorisedCourses({ page, count, categoryId }) {
	return axios.get(`/api/categorised-courses?page=${page}&count=${count}&categoryId=${categoryId}`).then((res) => res.data)
}

export function changeCourseStatus({courseId}) {
		return axios.patch(`/api/change-course-status?courseId=${courseId}`).then((res) => res.data)
	}
export function rejectCourse({courseId}) {
		return axios.patch(`/api/reject-course?courseId=${courseId}`).then((res) => res.data)
	}
export function getCoursesByTeacher({ page, count, query }) {
	return axios.get(`/api/teacher/courses?query=${query}&page=${page}&count=${count}`).then((res) => res.data)
}

export function getCourse(id) {
	if (!id) return
	return axios.get(`/api/course/${id}`).then((res) => res.data)
}

export async function createCourse({ course, selectedTab }) {
	const formData = new FormData()
	for (const key in course) {
		formData.append(key, course[key])
	}
	formData.append('selectedTab', selectedTab)
	return axios.post('/api/create-course', formData).then((res) => res.data)
}

export function uploadThumbnail({ file, courseId }) {
	console.log(file)
	console.log(courseId)
	const formData = new FormData()
	formData.append('thumbnail', file)
	return axios.post(`/api/course/${courseId}/thumbnail`, formData).then((res) => res.data)
}

export function getMuxUploadUrl() {
	return axios.get('/api/get-upload-url').then((res) => res.data)
}

export function createStripeSession({ courseId }) {
	return axios.post('/api/create-checkout-session', { courseId }).then((res) => res.data)
}

export function updateCourse({ courseId, title, description, category, level, thumbnail, price, mrp, chapters }) {
	const formData = new FormData()
	if (title) formData.append('title', title)
	if (description) formData.append('description', description)
	if (category) formData.append('category', category)
	if (level) formData.append('level', level)
	if (thumbnail) formData.append('thumbnail', thumbnail)
	if (price) formData.append('price', price)
	if (mrp) formData.append('mrp', mrp)

	if (chapters) formData.append('chapters', chapters)

	return axios.patch(`/api/update-course/${courseId}`, formData).then((res) => res.data)
}

export function deleteCourse(courseId) {
	return axios.delete(`/api/delete-course/${courseId}`).then((res) => res.data)
}

export function getEnrolledCourses({ page, count }) {
	return axios.get(`/api/my-courses?page=${page}&count=${count}`).then((res) => res.data)
}
export function getWishlistedCourses({ page, count }) {
	return axios.get(`/api/wishlisted-courses?page=${page}&count=${count}`).then((res) => res.data)
}
export function getEnrollment(courseId) {
	return axios
		.get(`/api/enrollment/${courseId}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}
export function setProgress({courseId,chapterId,segmentId}) {
	console.log(courseId,chapterId,segmentId)
	return axios
		.post(`/api/enrollment/${courseId}`,{chapterId,segmentId})
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}
export function getSalesHistory({ page, count, query }) {
	return axios.get(`/api/sales-history?page=${page}&count=${count}&query=${query}`).then((res) => res.data)
}