const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')
const Category = require('../models/Category')
const generateToken = require('../utils/generateToken')
const nodemailer = require('nodemailer')

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN

const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

module.exports = {
	login: async (req, res, next) => {
		try {
			const { email, password, role } = req.body

			if (!email || !password)
				return res.status(400).json({ success: false, errors: { toast: 'Please fill all fields' } })

			const user = await User.findOne({ email }).select('name email method role status password profileImage')
			if (!user)
				return res.status(404).json({
					success: false,
					errors: { email: 'You are not registered with us. Pls create an account.' },
				})

			if (user.method != 'local')
				return res.status(404).json({ success: false, errors: { toast: 'Please login with google' } })

			if (user.role != role)
				return res
					.status(404)
					.json({ success: false, errors: { email: `This Email is not registered for ${role}` } })

			const isPasswordValid = await user.comparePassword(password)
			if (!isPasswordValid)
				return res.status(401).json({
					success: false,
					errors: { password: 'The password you entered is incorrect. Please try again' },
				})

			if (user.status === 'blocked')
				return res.status(401).json({
					success: false,
					errors: { toast: 'Your account has been blocked. Please contact support' },
				})
				if (user.status === 'pending')
				return res.status(401).json({
					success: false,
					errors: { toast: 'Your account is not verified. Please contact support' },
				})

			const token=generateToken(res, user._id, role)
			res.status(200).json({
				success: true,
				user: {
					name: user.name,
					_id: user._id,
					email: user.email,
					profileImage: user.profileImage,
					role: user.role,
					accessToken:token
				},
			})
		} catch (error) {
			next(error)
		}
	},

	// const socialLogin = CatchAsyncError(async (req, res, next) => {
	// 	try {
	// 	  const { email, name, avatar } = req.body;
	// 	  const user = await User.findOne({ email });
	// 	  if (!user) {
	// 		const newUser = await User.create({ email, name, avatar });
	// 		sendToken(newUser, 200, res);
	// 	  } else {
	// 		sendToken(user, 200, res);
	// 	  }
	// 	} catch (error) {
	// 	  return next(new ErrorHandler(error.message, 400));
	// 	}
	//   });
	  


	socialLogin: async (req, res, next) => {
		try {
			const { type, code, role } = req.body

			const oauth2Client = new OAuth2Client({
				clientId,
				clientSecret,
				redirectUri: 'postmessage',
			})

			const { tokens } = await oauth2Client.getToken(code)
			oauth2Client.setCredentials(tokens)

			const url = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos'
			const userInfo = await oauth2Client.request({ url })

			const email = userInfo.data.emailAddresses[0].value
			const name = userInfo.data.names[0].displayName
			const profileImage = userInfo.data.photos[0].url
			const oauthAccessToken = tokens.access_token
			const oauthRefreshToken = tokens.refresh_token

			const user = await User.findOne({ email })
			if (!user) {
				const newUser = await User.create({
					name,
					method: 'google',
					oauthAccessToken,
					oauthRefreshToken,
					email,
					profileImage,
					role,
					status: 'active',
				})
				const token=generateToken(res, newUser._id, role)
				res.status(201).json({
					success: true,
					user: {
						_id: newUser._id,
						name: newUser.name,
						email: newUser.email,
						profileImage: newUser.profileImage,
						role: newUser.role,
						accessToken:token
					},
				})
			} else {
				if (user.status === 'blocked')
					return res.status(401).json({
						success: false,
						errors: { toast: 'Your account has been blocked. Please contact support' },
					})
				if (user.role !== role)
					return res
						.status(401)
						.json({ success: false, errors: { toast: `This Email is not registered for ${role} `} })
				user.oauthAccessToken = oauthAccessToken
				user.oauthRefreshToken = oauthRefreshToken
				await user.save()
				const token = generateToken(res, user._id, role)

				res.cookie(`jwt_${role}`, token, {
					maxAge: 30 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					secure: 'false',
				})

				res.status(200).json({
					success: true,
					user: {
						name: user.name,
						_id: user._id,
						email: user.email,
						profileImage: user.profileImage,
						role: user.role,
						accessToken: token,
					},
				})
			}
		} catch (error) {
			next(error)
		}
	},

	sendOtp: async (req, res, next) => {
		try {
			const { email, password, role } = req.body

			if (!email || !password) return res.status(400).json({ success: false, message: 'Please fill all fields' })

			const userExists = await User.findOne({ email })
			if (userExists) {
				if (userExists.status === 'active') {
					if (userExists.method === 'google')
						return res.status(400).json({
							success: false,
							errors: {
								toast: 'Please login with google',
							},
						})
					if (userExists.role !== role)
						return res.status(400).json({
							success: false,
							errors: {
								email: 'This email address is already associated with a different account type. Please provide an alternative email address.',
							},
						})
					if (userExists.role === role)
						return res.status(400).json({
							success: false,
							errors: {
								email: 'This email address is already on our records. Please consider logging in or resetting your password.',
							},
						})
				}
				if (userExists.status === 'blocked') {
					return res.status(400).json({
						success: false,
						errors: {
							toast: 'Account blocked',
						},
					})
				}
				if (userExists.status === 'pending') {
					await User.findByIdAndDelete(userExists._id)
				}
			}

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: 'colinv.ignatious@gmail.com',
					pass: 'wsuwnaosmmitgfgq',
					clientId,
					clientSecret,
					refreshToken,
				},
			})
			const otp = generateOTP()
			console.log('OTP: ', otp)
			let mailOptions = {
				from: 'colinv.ignatious@gmail.com',
				to: email,
				subject: `SelfUpdate verification code: ${otp}`,
				text: `Your OTP code is: ${otp}`,
			}

			const status = 'pending'
			await User.create({ email, password, role, otp, status })

			// transporter.sendMail(mailOptions, function (err, data) {
			// 	if (err) {
			// 		res.status(400).json({
			// 			success: false,
			// 			errors: { toast: 'Something went wrong, please try again' },
			// 		})
			// 	} else {
			// 		console.log('Email sent successfully')
			// 		res.status(201).json({
			// 			success: true,
			// 		})
			// 	}
			// })
			res.status(201).json({
						success: true,
				 		})
		} catch (error) {
			next(error)
		}
	},

	signup: async (req, res, next) => {
		try {
			const { email, password, role, otp } = req.body

			if (!email || !password)
				return res.status(400).json({
					success: false,
					errors: {
						toast: 'Something went wrong, please signup again',
					},
				})

			const user = await User.findOne({ email }).select('name email profileImage role otp')
			if (!user)
				return res.status(400).json({
					success: false,
					errors: {
						toast: 'Something went wrong, please signup again',
					},
				})

			if (user.otp !== otp)
				return res.status(400).json({
					success: false,
					errors: {
						otp: 'Please check the OTP you have entered',
					},
				})

			user.status = 'active'
			await user.save()

			const token=generateToken(res, user._id, role)
			res.status(201).json({
				success: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					profileImage: user.profileImage,
					role: user.role,
					accessToken:token
				},
			})
		} catch (error) {
			next(error)
		}
	},

	forgotpassword: async (req, res, next) => {
		try {
			const { email, password, role, otp } = req.body

			if (!email || !password)
				return res.status(400).json({
					success: false,
					errors: {
						toast: 'Something went wrong, please signup again',
					},
				})

			const user = await User.findOne({ email }).select('name email profileImage role otp')
			if (!user)
				return res.status(400).json({
					success: false,
					errors: {
						toast: 'Something went wrong, please signup again',
					},
				})

			if (user.otp !== otp)
				return res.status(400).json({
					success: false,
					errors: {
						otp: 'Please check the OTP you have entered',
					},
				})

			user.status = 'active'
			await user.save()

			generateToken(res, user._id, role)
			res.status(201).json({
				success: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					profileImage: user.profileImage,
					role: user.role,
				},
			})
		} catch (error) {
			next(error)
		}
	},

	forgotsendOtp: async (req, res, next) => {
		try {
			const { email, password,role } = req.body

			if (!email || !password) return res.status(400).json({ success: false, message: 'Please fill all fields' })

			const userExists = await User.findOne({ email })
			if (userExists) {
				if (userExists.status === 'active'||userExists.status === 'pending') {
					
					if (userExists.role !== role)
						return res.status(400).json({
							success: false,
							errors: {
								email: 'This email address is already associated with a different account type. Please provide an alternative email address.',
							},
						})
					
				}
				if (userExists.status === 'blocked') {
					return res.status(400).json({
						success: false,
						errors: {
							toast: 'Account blocked',
						},
					})
				}
				
			}

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: 'colinv.ignatious@gmail.com',
					pass: 'wsuwnaosmmitgfgq',
					clientId,
					clientSecret,
					refreshToken,
				},
			})
			const otp = generateOTP()
			console.log('OTP: ', otp)
			let mailOptions = {
				from: 'colinv.ignatious@gmail.com',
				to: email,
				subject: `SelfUpdate verification code: ${otp}`,
				text: `Your OTP code is: ${otp}`,
			}

			const status = 'pending'
			userExists.otp=otp;
			userExists.password=password;
			await userExists.save();
			// transporter.sendMail(mailOptions, function (err, data) {
			// 	if (err) {
			// 		res.status(400).json({
			// 			success: false,
			// 			errors: { toast: 'Something went wrong, please try again' },
			// 		})
			// 	} else {
			// 		console.log('Email sent successfully')
			// 		res.status(201).json({
			// 			success: true,
			// 		})
			// 	}
			// })
		} catch (error) {
			next(error)
		}
	},

	logoutUser: (req, res, next) => {
		const { role } = req.query
		try {
			res.cookie(`jwt_${role}`, '', {
				httpOnly: true,
				expires: new Date(0),
			})
			res.status(200).json({ success: true, message: 'Logged out successfully' })
		} catch (error) {
			next(error)
		}
	},

	updateUserProfile: async (req, res, next) => {
		try {
			const user = await User.findById(req.user._id)

			const checkEmail = await User.findOne({ email: req.body.email })
			if (checkEmail && checkEmail._id.toString() !== req.user._id.toString()) {
				return res.status(400).json({ message: 'Email already registered with another account' })
			}

			if (user) {
				user.name = req.body.name || user.name
				user.email = req.body.email || user.email

				if (req.body.password) {
					user.password = req.body.password
				}

				if (req.file) {
					user.profileImage = req.file.filename
				}

				const updatedUser = await user.save()

				res.status(200).json({
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
					profileImage: user.profileImage,
				})
			} else {
				res.status(404).json({ message: 'User not found' })
			}
		} catch (error) {
			next(error)
		}
	},

	getAllUsers: async (req, res, next) => {
		try {
			const { page, count } = req.query
			const totalUsers = await User.countDocuments({ role: 'user' })
			const users = await User.find({ role: 'user' })
				.select('-password')
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalUsers, users })
		} catch (error) {
			next(error)
		}
	},

	getAllTeachers: async (req, res, next) => {
		try {
			const { page, count } = req.query
			const countUsers = await User.countDocuments({ role: 'teacher' })
			const users = await User.find({ role: 'teacher' })
				.select('-password')
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, countUsers, users })
		} catch (error) {
			next(error)
		}
	},

	changeUserStatus: async (req, res, next) => {
		try {
			const { id, status } = req.query
			if (!id || !status) return res.status(400).json({ success: false, message: 'Please provide id and status' })
			
            const user = await User.findById(id)
			if (!user) return res.status(404).json({ success: false, message: 'User not found' })
			
            user.status = status === 'unblock' ? 'active' : 'blocked'
			await user.save()
			res.status(200).json({ success: true })
		} catch (error) {
			next(error)
		}
	},

	getUsersOfTeacher: async (req, res, next) => {
		try {
			const { page, count } = req.query
			const totalUsers = await Enrollment.countDocuments({ teacher: req.user._id })
			const users = await Enrollment.find({ teacher: req.user._id })
				.select('-password')
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalUsers, users })
		} catch (error) {
			next(error)
		}
	},

	getAllAnalyticsTeacher: async (req, res, next) => {
		try {
			const totalPublishedCourses = await Course.countDocuments({ teacher: req.user._id, status: 'Published' })
			const totalEnrolledCourses = await Enrollment.countDocuments({ teacher: req.user._id })
			const totalCoursesEnrolled = await Enrollment.aggregate([
				{
					$match: {
						teacher: req.user._id,
					},
				},
				{
					$lookup: {
						from: 'courses',
						localField: 'course',
						foreignField: '_id',
						as: 'course',
					},
				},
				{
					$unwind: '$course',
				},
				{
					$group: {
						_id: null,
						totalAmountEarned: { $sum: '$course.price' },
					},
				},
				{
					$project: {
						_id: 0,
						totalAmountEarned: 1,
					},
				},
			])

			let enrollmentsPerDay = await Enrollment.aggregate([
				{
					$match: {
						teacher: req.user._id,
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$purchasedAt' } },
						count: { $sum: 1 },
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$project: {
						date: '$_id',
						count: 1,
						_id: 0,
					},
				},
			])

			let topCourses = await Enrollment.aggregate([
				{
					$match: {
						teacher: req.user._id,
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$purchasedAt' } },
						count: { $sum: 1 },
						course: { $first: '$course' },
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
                {
                    $limit: 5,
                },
				{
					$group: {
						_id: '$course',
						data: { $push: { x: '$_id', y: '$count' } },
					},
				},
				{
					$lookup: {
						from: 'courses',
						localField: '_id',
						foreignField: '_id',
						as: 'course',
					},
				},
				{
					$unwind: '$course',
				},
				{
					$project: {
						_id: 0,
						id: '$course.title',
						data: 1,
					},
				},
			])

			topCourses = topCourses.map((it, index) => {
				return {
					id: it?.id,
					data: it?.data.map((it2, i) => {
						return {
							x: it2.x,
							y: it2.y + (it?.data[i - 1]?.y || 0),
						}
					}),
					color: index,
				}
			})

			let countByCategory = await Course.aggregate([
				{
					$match: {
						teacher: req.user._id,
					},
				},
				{
					$group: {
						_id: '$category',
						count: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: '_id',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						id: { $ifNull: ['$category.title', 'No Category'] },
						value: '$count',
					},
				},
				{
					$group: {
						_id: '$id',
						value: { $sum: '$value' },
					},
				},
			]);
			
			// Ensure all categories are present, even those with no courses
			const allCategories = await Category.find({});
			allCategories.forEach(category => {
				const existingData = countByCategory.find(data => data._id === category.title);
				if (!existingData) {
					countByCategory.push({
						_id: category.title,
						value: 0,
					});
				}
			});
			
			countByCategory = countByCategory.map((it, index) => {
				return {
					id: it._id,
					value: it.value,
					label: it._id,
					color: index,
				};
			});

			res.status(200).json({
				success: true,
				data: {
					totalPublishedCourses,
					totalEnrolledCourses,
					topCourses,
					totalAmountEarned: totalCoursesEnrolled[0]?.totalAmountEarned || 0,
					countByCategory,
					enrollmentsPerDay,
				},
			})


		} catch (error) {
			next(error)
		}
	},

	getAllAnalyticsAdmin: async (req, res, next) => {
		try {
			const totalPublishedCourses = await Course.countDocuments({status: 'Published' })
			const totalEnrolledCourses = await Enrollment.countDocuments()
			const totalCoursesEnrolled = await Enrollment.aggregate([
				
				{
					$lookup: {
						from: 'courses',
						localField: 'course',
						foreignField: '_id',
						as: 'course',
					},
				},
				{
					$unwind: '$course',
				},
				{
					$group: {
						_id: null,
						totalAmountEarned: { $sum: '$course.price' },
					},
				},
				{
					$project: {
						_id: 0,
						totalAmountEarned: 1,
					},
				},
			])
			let enrollmentsPerDay = await Enrollment.aggregate([
				
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$purchasedAt' } },
						count: { $sum: 1 },
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$project: {
						date: '$_id',
						count: 1,
						_id: 0,
					},
				},
			])

			let topCourses = await Enrollment.aggregate([
				
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$purchasedAt' } },
						count: { $sum: 1 },
						course: { $first: '$course' },
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
                {
                    $limit: 5,
                },
				{
					$group: {
						_id: '$course',
						data: { $push: { x: '$_id', y: '$count' } },
					},
				},
				{
					$lookup: {
						from: 'courses',
						localField: '_id',
						foreignField: '_id',
						as: 'course',
					},
				},
				{
					$unwind: '$course',
				},
				{
					$project: {
						_id: 0,
						id: '$course.title',
						data: 1,
					},
				},
			])

			topCourses = topCourses.map((it, index) => {
				return {
					id: it?.id,
					data: it?.data.map((it2, i) => {
						return {
							x: it2.x,
							y: it2.y + (it?.data[i - 1]?.y || 0),
						}
					}),
					color: index,
				}
			})

			let countByCategory = await Course.aggregate([
				
				{
					$group: {
						_id: '$category',
						count: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: '_id',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						id: { $ifNull: ['$category.title', 'No Category'] },
						value: '$count',
					},
				},
				{
					$group: {
						_id: '$id',
						value: { $sum: '$value' },
					},
				},
			]);
			
			// Ensure all categories are present, even those with no courses
			const allCategories = await Category.find({});
			allCategories.forEach(category => {
				const existingData = countByCategory.find(data => data._id === category.title);
				if (!existingData) {
					countByCategory.push({
						_id: category.title,
						value: 0,
					});
				}
			});

			countByCategory = countByCategory.map((it, index) => {
				return {
					id: it._id,
					value: it.value,
					label: it._id,
					color: index,
				}
			})

			res.status(200).json({
				success: true,
				data: {
					totalPublishedCourses,
					totalEnrolledCourses,
					topCourses,
					totalAmountEarned: totalCoursesEnrolled[0]?.totalAmountEarned || 0,
					countByCategory,
					enrollmentsPerDay,
				},
			})


		} catch (error) {
			next(error)
		}
	},
}
