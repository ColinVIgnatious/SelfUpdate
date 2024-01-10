import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	admin:
		typeof window !== 'undefined' && localStorage.getItem('adminInfo')
			? JSON.parse(localStorage.getItem('adminInfo'))
			: null,
}

const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {
		login: (state, action) => {
			state.admin = action.payload
			localStorage.setItem('adminInfo', JSON.stringify(action.payload))
		},
		logout: (state) => {
			state.admin = null
			localStorage.removeItem('adminInfo')
		},
	},
})

export const { login, logout } = adminSlice.actions
export default adminSlice.reducer
