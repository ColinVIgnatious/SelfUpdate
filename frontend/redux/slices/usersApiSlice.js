import { apiSlice } from './apiSlice'
const USERS_URL = '/api'

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// login: builder.mutation({
		// 	query: (credentials) => ({
		// 		url: USERS_URL + '/login',
		// 		method: 'POST',
		// 		body: credentials,
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// socialLogin: builder.mutation({
		// 	query: (data) => ({
		// 		url: USERS_URL + '/social-login',
		// 		method: 'POST',
		// 		body: data,
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// sendOtp: builder.mutation({
		// 	query: (data) => ({
		// 		url: USERS_URL + '/send-otp',
		// 		method: 'POST',
		// 		body: data,
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// signup: builder.mutation({
		// 	query: (credentials) => ({
		// 		url: USERS_URL + '/signup',
		// 		method: 'POST',
		// 		body: credentials,
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// update: builder.mutation({
		// 	query: (credentials) => ({
		// 		url: USERS_URL + '/profile',
		// 		method: 'PATCH',
		// 		body: credentials,
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// logout: builder.query({
		// 	query: () => ({
		// 		url: USERS_URL + '/logout',
		// 		method: 'GET',
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
		// GetAllUsers: builder.query({
		// 	query: (page, count) => ({
		// 		url: USERS_URL + `/all-users?page=${page}`,
		// 		method: 'GET',
		// 	}),
		// 	keepUnusedData: true,
		// 	invalidatesTags: ['User'],
		// }),
		// GetAllTeachers: builder.query({
		// 	query: (page, count) => ({
		// 		url: USERS_URL + `/all-teachers?page=${page}`,
		// 		method: 'GET',
		// 	}),
		// 	keepUnusedData: true,
		// 	invalidatesTags: ['User'],
		// }),
		// blockUser: builder.query({
		// 	query: ({ id, action }) => ({
		// 		url: USERS_URL + `/block-user?id=${id}&action=${action}`,
		// 		method: 'GET',
		// 	}),
		// 	invalidatesTags: ['User'],
		// }),
	}),
})

export const {
	// useSocialLoginMutation,
	// useLazyLogoutQuery,
	// useSignupMutation,
	// useUpdateMutation,
	// useLazyGetAllUsersQuery,
	// useLazyGetAllTeachersQuery,
	// useLazyBlockUserQuery,
	// useSendOtpMutation
} = usersApiSlice
