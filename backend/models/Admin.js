const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please Enter Your Email address'],
		validate: [validator.isEmail, 'Please Enter a Valid Email'],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: function () {
            return this.method === 'local'
        },
		minLength: [4, 'Password should have atleast 4 Chars'],
		trim: true,
	},
})

adminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}
	this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Admin', adminSchema, 'admins')
