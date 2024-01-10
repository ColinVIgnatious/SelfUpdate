const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Admin = require('../models/Admin')    

module.exports = {
	protect: async (req, res, next) => {
		const token = req.cookies.jwt_user
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET)
				req.user = await User.findById(decoded.userId).select('-password')
				if (req.user.role !== 'user')
					return res.status(401).json({ success: false, message: 'Pls use a user acoount' })
				if (req.user.status === 'blocked')
					return res.status(401).json({ success: false, message: 'Your account has been blocked' })
				if (req.user.status === 'pending')
					return res.status(401).json({ success: false, message: 'Your account verification is pending' })
				next()
			} catch (error) {
				console.error(error)
				res.status(401).json({
					success: false,
					message: 'Something went wrong. Please login again',
				})
			}
		} else {
			res.status(401).json({ success: false, message: 'Please login to continue' })
		}
	},

	protectTeacher: async (req, res, next) => {
		const token = req.cookies.jwt_teacher
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET)
				req.user = await User.findById(decoded.userId).select('-password')
				if (req.user.role !== 'teacher')
					return res.status(401).json({ success: false, message: 'Pls use a teacher acoount' })
				if (req.user.status === 'blocked')
					return res.status(401).json({ success: false, message: 'Your account has been blocked' })
				if (req.user.status === 'pending')
					return res.status(401).json({ success: false, message: 'Your account verification is pending' })
				next()
			} catch (error) {
				console.error(error)
				res.status(401).json({
					success: false,
					message: 'Something went wrong. Please login again',
				})
			}
		} else {
			res.status(401).json({ success: false, message: 'Please login to continue' })
		}
	},

	protectAdmin: async (req, res, next) => {
		const token = req.cookies.jwt_admin
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET)
				req.user = await Admin.findById(decoded.userId).select('-password')
				next()
			} catch (error) {
				console.error(error)
				res.status(401).json({
					success: false,
					message: 'Something went wrong. Please login again',
				})
			}
		} else {
			res.status(401).json({ success: false, message: 'Please login to continue' })
		}
	},

	checkUser: async (req, res, next) => {
		const token = req.cookies.jwt_user
		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			req.user = await User.findById(decoded.userId).select('-password')
		}
		next()
	},
}
