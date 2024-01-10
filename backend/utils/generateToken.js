const jwt = require('jsonwebtoken')

const generateToken = (res, userId, role) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})

	res.cookie(`jwt_${role}`, token, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		secure: 'false',
	})
	return token;
}

module.exports = generateToken
