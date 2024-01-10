import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user:
		typeof window !== 'undefined' && localStorage.getItem('userInfo')
			? JSON.parse(localStorage.getItem('userInfo'))
			: null,
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action) => {
            console.log('logged in')
			state.user = action.payload
			localStorage.setItem('userInfo', JSON.stringify(action.payload))
		},
		logout: (state) => {
            console.log('logged out')
			state.user = null
			localStorage.removeItem('userInfo')
		},
	},
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
