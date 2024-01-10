import axios from 'axios'
export function loginUser({ email, password, role }) {
	return axios.post('/api/admin/login', { email, password, role }).then((res) => res.data)
}
export function logoutUser() {
    return axios.get('/api/admin/logout?role=admin').then((res) => res.data)
}
