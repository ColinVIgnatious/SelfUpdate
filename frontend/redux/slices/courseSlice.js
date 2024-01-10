import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	course: null,
}

const courseSlice = createSlice({
	name: 'course',
	initialState,
	reducers: {
		add: (state, action) => {
			state.course = action.payload
			localStorage.setItem('courseInfo', JSON.stringify(action.payload))
		},
		remove: (state) => {
			state.course = null
			localStorage.removeItem('courseInfo')
		},
	},
})

export const { add, remove } = courseSlice.actions
export default courseSlice.reducer
