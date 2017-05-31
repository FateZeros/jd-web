var main = require('../handlers/main');
var credentials = require('../credentials.js');
// 邮箱地址同时做后端验证
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
// 手机号码验证
var VALID_MOBILE_REGEX = /^1[3|5|7|8][0-9]{9}$/;
// Email
var emailService = require('../lib/email.js')(credentials);

var User = require('../models/user.js');

module.exports = function(app) {
	/*** 页面路由 Start ***/
	app.get('/', main.home);

	app.get('/about', main.about);

	/** 注册 模块 **/
	app.get('/register', main.register);
	app.post('/register', function(req, res) {
		// console.log(req.body)
		// console.log('Form (from querystring): ' + req.query.form);
		// console.log('CSRF token (from hidden form field): ' + req.body._csrf);
		// console.log('Name (from visible form field): ' + req.body.username);
		// console.log('PASSWD: ' + req.body.passwd);
		// console.log('REPASSWD: ' + req.body.repasswd);
		var mobile = req.body.mobile || ''
		var email = req.body.email || ''
		if (!mobile.match(VALID_MOBILE_REGEX)) {
			if (req.xhr) return res.send({ code: 40001, message: '手机验证失败' })
		}
		if(!email.match(VALID_EMAIL_REGEX)) {
			if (req.xhr) return res.send({ code: 40002, message: '邮箱验证失败' })
		}

		// 写入参数过多时
		var query = {
			passwd: req.body.repasswd,
			mobile: mobile,
			email: email
		}

		User.update(
			{ name: req.body.username },
			query,
			{ upsert: true },
			function(err) {
				console.log(err)
				if (err) {
					return res.redirect(303, '/thank-you');
				}
				//发送邮件
				emailService.send('1031720197@qq.com', 'Hello LDM', 'Hello');
				return res.send({ code: 200, message: '注册成功' });
			}
		);
	})

	/** 登录 模块 **/
	app.get('/login', main.login);


	app.get('/jq-test', function(req, res) {
		res.render('jq-test');
	});

	app.get('/tours/hood-river', function(req, res) {
		res.render('tours/hood-river');
	});

	app.get('/tours/request-group-rate', function(req, res) {
		res.render('tours/request-group-rate');
	});

	app.get('/newsletter', function(req, res) {
		res.render('newsletter', {
			csrf: 'CSRF token'
		});
	});

	app.post('/process', function(req, res) {
		console.log('Form (from querystring): ' + req.query.form);
		console.log('CSRF token (from hidden form field): ' + req.body._csrf); 
		console.log('Name (from visible form field): ' + req.body.name); 
		console.log('Email (from visible form field): ' + req.body.email); 
		if (req.xhr || req.accepts('json,html') === 'json') {
			res.send({ success: true });
		} else {
			res.redirect(303, '/thank-you');
		}	
	});

	app.get('/contest/vacation-photo',function(req,res) { 
		var now = new Date(); 
		res.render('contest/vacation-photo', {
	    year: now.getFullYear(),
	    month: now.getMonth()
	  });
	});

	app.post('/contest/vacation-photo/:year/:month', function(req, res) { 
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			if(err) return res.redirect(303, '/error'); 
				console.log('received fields:'); 
				console.log(fields);
				console.log('received files:'); 
				console.log(files);
		    res.redirect(303, '/thank-you');
	    });
	});

	app.get('/thank-you', function(req, res) {
		res.render('thank-you');
	});

	/*** 页面路由 END ***/
}