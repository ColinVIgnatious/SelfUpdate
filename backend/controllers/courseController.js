const Mux = require('@mux/mux-node')
const stripe = require('../config/stripe')
const Course = require('../models/Course')
const Chapter = require('../models/Chapter')
const Category = require('../models/Category')
const Segment = require('../models/Segment')
const Enrollment = require('../models/Enrollment')
// const Wishlist = require('../models/Wishlist')
const User = require('../models/User')
const { uploadToS3 } = require('../helpers/awsHelpers')
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)
const Favorite = require('../models/Wishlist')

module.exports = {
	// Get all courses
	getAllCourses: async (req, res, next) => {
		try {
			const courses = await Course.find()
			res.status(200).json({ success: true, courses })
		} catch (error) {
			next(error)
		}
	},

	getCourses: async (req, res, next) => {
		try {
			const { count, type } = req.query
			const page = parseInt(req.query.page) || 1
			if (type === 'latest') sort = { createdAt: -1 }
			const courses = await Course.find({ status: 'Published' })
				.sort(sort)
				.limit(count)
				.skip((page - 1) * count)
				.populate('teacher', 'name')
				.lean()
			if (req.user) {
					const favorites = await Favorite.find({ user: req.user._id })
					courses.forEach((course) => {
						course.isFavorite = favorites.some(
							(favorite) => favorite.course.toString() === course._id.toString()
						)
					})
				}
				
			res.status(200).json({ success: true, courses})
		} catch (error) {
			next(error)
		}
	},

	

	getPendingCourses: async (req, res, next) => {
		try {
			const { page, count } = req.query
			const totalCourses = await Course.countDocuments({ status: 'Pending Approval' })
			const courses = await Course.find({ status: 'Pending Approval' })
				
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalCourses, courses })
		} catch (error) {
			next(error)
		}
	},

	getCategorisedCourses: async (req, res, next) => {
		try {
			const { page, count } = req.query
			const totalCourses = await Course.countDocuments({ category: category._id })
			const courses = await Course.find({ category: category._id })
				
				.limit(count)
				.skip((page - 1) * count)
			res.status(200).json({ success: true, totalCourses, courses })
		} catch (error) {
			next(error)
		}
	},

	// Get all courses by category
	getCoursesByTeacher: async (req, res, next) => {
		try {
			const { page, count, query } = req.query
			const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

			const totalCourses = await Course.countDocuments({
				teacher: req.user._id,
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
			const courses = await Course.find({
				teacher: req.user._id,
				$or: [{ $text: { $search: query } }, { title: { $regex: new RegExp(escapedQuery, 'i') } }],
			})
				.limit(count)
				.skip((page - 1) * count)
				.populate('category', 'title')
			res.status(200).json({ success: true, totalCourses, courses })
		} catch (error) {
			next(error)
		}
	},

	// Get all courses by ID
	getCourseByID: async (req, res, next) => {
		try {
			const course = await Course.findById(req.params.id)
				.select('-__v')
				.populate('teacher', 'name')
				.populate('category', 'title')
				.populate({
					path: 'chapters',
					populate: {
						path: 'segments',
					},
				})
			res.status(200).json({ success: true, course })
		} catch (error) {
			next(error)
		}
	},

	// Create a course
	createCourse: async (req, res, next) => {
		
			try {
				const { _id: courseId, title, description, category, level, price, mrp, selectedTab } = req.body
	
				if (selectedTab === 'title_only') {
					if (!title || !title.trim())
						return res.status(400).json({ success: false, errors: { title: 'Title is required' } })
					if (title.trim().length < 3)
						return res
							.status(400)
							.json({ success: false, errors: { title: 'Title must be atleast 3 characters long' } })
					const course = await Course.create({ teacher: req.user._id, title })
					let chapter
					try {
						chapter = await Chapter.create({ title: 'Introduction', course: course._id })
					} catch (error) {
						await Course.findByIdAndDelete(course._id)
						next(error)
					}
					course.chapters.push(chapter._id)
					await course.save()
					return res.status(200).json({ success: true, course })
				}
	
				if (!courseId) return res.status(400).json({ success: false, message: 'Invalid request' })
				const course = await Course.findById(courseId)
				if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
				if (course.teacher.toString() !== req.user.id)
					return res.status(401).json({ success: false, message: 'You are not authorized to update this course' })
	
				if (selectedTab === 'general') {
					if (!title || !title.trim())
						return res.status(400).json({ success: false, errors: { title: 'Title is required' } })
					if (title.trim().length < 3)
						return res
							.status(400)
							.json({ success: false, errors: { title: 'Title must be atleast 3 characters long' } })
					if (!description || !description.trim())
						return res.status(400).json({ success: false, errors: { description: 'Description is required' } })
					if (description.trim().length < 10)
						return res.status(400).json({
							success: false,
							errors: { description: 'Description must be atleast 10 characters long' },
						})
					if (!category || !category.trim())
						return res.status(400).json({ success: false, errors: { category: 'Category is required' } })
					if (!level || !level.trim())
						return res.status(400).json({ success: false, errors: { level: 'Level is required' } })
	
					course.title = title
					course.description = description
					course.category = category
					course.level = level
					await course.save()
				} else if (selectedTab === 'pricing') {
					if (!price || !price.trim())
						return res.status(400).json({ success: false, errors: { price: 'Price is required' } })
					if (!mrp || !mrp.trim())
						return res.status(400).json({ success: false, errors: { mrp: 'MRP is required' } })
					course.price = price
					course.mrp = mrp
					await course.save()
				}
				res.status(200).json({ success: true, course })
			} catch (error) {
				next(error)
			}
	},

	// Update a course
	updateCourse: async (req, res, next) => {
		try {
			const { title, description, category, level, thumbnail, price, mrp, chapters } = req.body
			const course = await Course.findById(req.params.id)
			if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
			if (course.teacher.toString() !== req.user.id)
				return res.status(401).json({ success: false, message: 'You are not authorized to update this course' })
			if (title) course.title = title
			if (description) course.description = description
			if (category) course.category = category
			if (level) course.level = level
			if (price) course.price = price
			if (mrp) course.mrp = mrp
			if (thumbnail) {
				const imgUrl = await uploadToS3('courses', req.file)
				if (imgUrl) course.image = `https://selfupdate.s3.ap-south-1.amazonaws.com/courses/${imgUrl}`
			}
		} catch (error) {
			next(error)
		}
	},

	// Delete a course
	deleteCourse: async (req, res, next) => {
		try {
			const course = await Course.findOne({ _id: req.params.id, teacher: req.user.id })
			if (course) {
				const enrolledCount = await Enrollment.countDocuments({ course: req.params.id })
				if (enrolledCount > 0)
					return res
						.status(400)
						.json({ success: false, message: 'You cannot delete a course which has students enrolled' })
				await Course.findByIdAndDelete(req.params.id)
				res.status(200).json({ success: true, message: 'Course deleted' })
			} else {
				res.status(404).json({ message: 'Course not found' })
			}
		} catch (error) {
			next(error)
		}
	},

	// Add a chapter to a course
	createCheckoutSession: async (req, res, next) => {
		console.log(req.body)
		try {
			const courseId = req.body.courseId
			const userId = req.user.id
			if (!courseId) return res.status(400).json({ success: false, message: 'Invalid request' })
			const course = await Course.findById(courseId)
			if (course?.status !== 'Published')
				return res.status(400).json({ success: false, message: 'Course is not published yet' })

			const enrolled = await Enrollment.findOne({ course: courseId, student: userId })
			if (enrolled) return res.status(400).json({ success: false, message: 'You already enrolled this course' })
			else {
				let stripCustomerId = req?.user?.stripCustomerId
				if (!stripCustomerId) {
					const customer = await stripe.customers.create({
						email: req?.user?.email,
						name: req?.user?.name,
					})
					stripCustomerId = customer.id
					await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id })
				}
				const line_items = [
					{
						price_data: {
							currency: 'inr',
							product_data: {
								name: course.title,
							},
							unit_amount: course.price * 100,
						},
						quantity: 1,
					},
				]
				const session = await stripe.checkout.sessions.create({
					customer: stripCustomerId,
					payment_method_types: ['card'],
					line_items,
					mode: 'payment',
					success_url: `${process.env.CLIENT_URL}/courses/${course._id}?success=1`,
					cancel_url: `${process.env.CLIENT_URL}/courses/${course._id}?canceled=1`,
					metadata: {
						courseId: courseId,
						studentId: userId,
					},
				})
				res.status(200).json({ success: true, sessionUrl: session.url })
			}
		} catch (error) {
			next(error)
		}
	},

	// Get MUX upload url for video upload
	createMuxUploadUrl: async (req, res, next) => {
		const upload = await Video.Uploads.create({
			cors_origin: '*',
			new_asset_settings: {
				playback_policy: 'public',
			},
		})

		res.status(200).json({ success: true, uploadUrl: upload.url, uploadId: upload.id })
	},

	getStripeIntent: async (req, res, next) => {
		try {
			const { amount } = req.body
			const paymentIntent = await stripe.paymentIntents.create({
				amount: 100 * 100,
				currency: 'inr',
			})
			res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret })
		} catch (error) {
			next(error)
		}
	},

	updateCourseImage: async (req, res, next) => {
		try {
			const { id: courseId } = req.params
			if (!courseId) return res.status(400).json({ success: false, message: 'Invalid request' })
			if (req.file) {
				var imgUrl = await uploadToS3('courses', req.file)
				const course = await Course.findById(courseId)
				course.thumbnail = `https://selfupdate.s3.ap-south-1.amazonaws.com/courses/${imgUrl}`
				await course.save()
				res.status(200).json({ success: true, thumbnail: course.thumbnail })
			} else {
				res.status(400).json({
					success: false,
					errros: { thumbnail: 'Looks like the image you chose didnt work' },
				})
			}
		} catch (error) {
			next(error)
		}
	},

	getEnrolledCourses: async (req, res, next) => {
        try {
            const { page, count } = req.query
            const totalCourses = await Enrollment.countDocuments({ student: req.user._id })
            const courses = await Enrollment.find({ student: req.user._id })
                .limit(count)
                .skip((page - 1) * count)
                .populate({
					path: 'course',
					populate: {
						path: 'chapters',
						populate: {
							path: 'segments',
						},
					},
				})
            res.status(200).json({ success: true, totalCourses, courses })
        } catch (error) {
            next(error)
        }
    },

	getWishlistedCourses: async (req, res, next) => {
        try {
            const { page, count } = req.query
            const totalCourses = await Favorite.countDocuments({ user: req.user._id })
            const courses = await Favorite.find({ user: req.user._id })
                .limit(count)
                .skip((page - 1) * count)
                .populate('course')
            res.status(200).json({ success: true, totalCourses, courses })
        } catch (error) {
            next(error)
        }
    },

	changeCourseStatus: async (req, res, next) => {
		try {
			const { id, status } = req.query
			if (!id || !status) return res.status(400).json({ success: false, message: 'Please provide id and status' })
			
            const course = await Course.findById(id)
			if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
			
            course.status = 'Published'
			await course.save()
			res.status(200).json({ success: true })
		} catch (error) {
			next(error)
		}
	},

	getSearchCourses: async (req, res, next) => {
		try {
		 let { count, search } = req.query
	     console.log("search",search);
	
		 console.log("count",count);
		 
		const page = 1
		 count = parseInt(count) || 10
	   
		//  const sortQuery = {}
		//  if (sort) {
		//   if (sort === 'latest') sortQuery['createdAt'] = -1
		//   if (sort === 'price-desc') sortQuery['price'] = -1
		//   if (sort === 'price-asc') sortQuery['price'] = 1
		  // TODO: Add more sort options
		  // if(sort === 'popular') sortQuery['enrolledCount'] = -1
		  // if(sort === 'highest-rated') sortQuery['rating'] = -1
		//  }
	   
		 let filterArray = [{ status: 'Published' }]
	   
		//  filter = decodeURIComponent(filter)
		//  if (filter) {
		//   filter.split('&').forEach((item) => {
		//    const [key, value] = item.split('=')
		//    if (key === 'level') filterArray.push({ level: { $in: value.split(',') } })
		//    if (key === 'category') filterArray.push({ category: { $in: value.split(',') } })
		//    if (key === 'price') {
		// 	const [min, max] = value.split('-')
		// 	filterArray.push({ price: { $gte: min, $lte: max } })
		//    }
		//   })
		//  }
	   
		 search = decodeURIComponent(search)
		 const escapedSearchQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		 if (escapedSearchQuery) {
		  filterArray.push({
		   $or: [
			{ $text: { $search: search } },
			{ title: { $regex: new RegExp(search, 'i') } },
		   ],
		  })
		 }
	   console.log("filter",filterArray)
		 const totalCourses = await Course.countDocuments({ $and: filterArray })
		 const courses = await Course.find({ $and: filterArray })
		  .populate('teacher', 'name profileImage')
		//   .sort(sortQuery)
		  .limit(count)
		  .skip((page - 1) * count)
		  .lean()
	   
		 if (req.user) {
		  const favorites = await Favorite.find({ user: req.user._id })
		  courses.forEach((course) => {
		   course.isFavorite = favorites.some((favorite) => favorite.course.toString() === course._id.toString())
		  })
		 }
		 
		 res.status(200).json({ success: true, totalCourses, courses })
		} catch (error) {
		 next(error)
		}
	   }
}
