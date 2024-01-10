import axios from 'axios'
const BASE_URL = '/api'

module.exports = {
	loginUser: async ({ email, password, role }) => {
		return axios.post(`${BASE_URL}/login`, { email, password, role }).then((res) => res.data)
	},
	forgotPassword: async (data) => {
		return axios.post(`${BASE_URL}/forgotpassword`, data).then((res) => res.data)
	},
	forgotSendOtp: async (data) => {
		return axios.post(`${BASE_URL}/forgotsend-otp`, data).then((res) => res.data)
	},
	socialLoginUser: async ({ type, code, role }) => {
		return axios.post(`${BASE_URL}/social-login`, { type, code, role }).then((res) => res.data)
	},
	logoutUser: async (role) => {
		return axios.get(`${BASE_URL}/logout?role=${role}`).then((res) => res.data)
	},
	sendOtp: async (data) => {
		return axios.post(`${BASE_URL}/send-otp`, data).then((res) => res.data)
	},
	signupUser: async (data) => {
		return axios.post(`${BASE_URL}/signup`, data).then((res) => res.data)
	},
	getAllTeachers: async ({ page, count }) => {
		return axios.get(`${BASE_URL}/all-teachers?page=${page}&count=${count}`).then((res) => res.data)
	},
    changeUserStatus: async ({id, status}) => {
        return axios.patch(`${BASE_URL}/change-status?id=${id}&status=${status}`).then((res) => res.data)
    },
    getAllUsers: async ({ page, count, query }) => {
        return axios.get(`${BASE_URL}/all-users?page=${page}&count=${count}&query=${query}`).then((res) => res.data)
    },
}
