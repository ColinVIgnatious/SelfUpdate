import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	teacher:
		typeof window !== 'undefined' && localStorage.getItem('teacherInfo')
			? JSON.parse(localStorage.getItem('teacherInfo'))
			: null,
}

const teacherSlice = createSlice({
	name: 'teacher',
	initialState,
	reducers: {
		login: (state, action) => {
			state.teacher = action.payload
			localStorage.setItem('teacherInfo', JSON.stringify(action.payload))
		},
		logout: (state) => {
			state.teacher = null
			localStorage.removeItem('teacherInfo')
		},
	},
})

export const { login, logout } = teacherSlice.actions
export default teacherSlice.reducer
