import axios from 'axios'

export function createCategory({ title, description, status }) {
	return axios
		.post(`/api/category/`, { title, description, status })
		.then((res) => res.data.category)
		.catch((err) => {
			throw err
		})
}

export function updateCategory({ id, title, description, status }) {
	return axios
		.patch(`/api/category/${id}`, { title, description, status })
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}

export function getCategoryById(categoryId) {
	return axios
		.get(`/api/category/${categoryId}`)
		.then((res) => res.data.category)
		.catch((err) => {
			throw err
		})
}

export function deleteCategory(categoryId) {
	return axios
		.delete(`/api/category/${categoryId}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}

export function getAllCategories({ page, count, query }) {
	return axios
		.get(`/api/categories?page=${page}&count=${count}&query=${query}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}

export function getAllCategoriesUser({ page, count, query }) {
	return axios
		.get(`/api/categories-for-user?page=${page}&count=${count}&query=${query}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}


export function getCategoriesForTeacher() {
	return axios
		.get('/api/categories-for-teacher')
		.then((res) => res.data.categories)
		.catch((err) => {
			throw err
		})
}

export function changeCategoryStatus({ id, status }) {
	return axios
		.patch(`/api/change-category-status?id=${id}&status=${status}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err
		})
}


