var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: String,
	passwd: String,
	mobile: String,
	email: String
});

var User = mongoose.model('User', userSchema);
module.exports = User;