var express = require('express');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/user.js');
var credentials = require('./credentials.js');

var options = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};

switch(app.get('env')){
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, options);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, options);
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}

//init users
User.find(function(err, users) {
	if(users.length) return;

	new User({
		name: 'Lily',
		passwd: '123',
		mobile: '18627716271',
		email: '490293266@qq.com'
	}).save();

	new User({
		name: 'Lucy',
		passwd: '123',
		mobile: '13567711231',
		email: '490293266@qq.com'
	}).save();
});