const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, 'Name should have atleast 3 Chars'],
		default: 'User',
		trim: true,
	},
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true,
        default: 'local',
        select: false,
	},
	oauthAccessToken: {
		type: String,
		required: function () {
			return this.method !== 'local'
		},
        select: false,
	},
	oauthRefreshToken: {
		type: String,
		required: function () {
			return this.method !== 'local'
		},
        select: false,
	},
	email: {
        type: String,
        required: [true, 'Please Enter Your Email address'],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: 'Please enter a valid email',
        },
        unique: true,
        lowercase: true,
        trim: true,
    },
	password: {
        type: String,
        required: function () {
            return this.method === 'local';
        },
        validate: {
            validator: function (value) {
                // Password should have at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return regex.test(value);
            },
            message: 'Password should have at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        },
        trim: true,
        select: false,
    },
    role:{
        type: String,
        required: true,
		enum: ['user', 'teacher', 'admin'],
    },
    otp: {
        type: String,
        select: false,
    },
	status: {
        type: String,
        enum: ['pending', 'active', 'blocked'],
        default: 'pending',
    },
	profileImage: {
		type: String,
		default: 'https://selfupdate.s3.ap-south-1.amazonaws.com/default_avatar.png',
	},
    stripCustomerId: {
        type: String,
        select: false,
    },
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}
	this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema, 'users')
