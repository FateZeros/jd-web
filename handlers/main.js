/* 主页路由 处理 */
var fortune = require('../lib/fortune.js');

// 按逻辑对处理器进行分组。
exports.home = function(req, res) {
	res.render('home', {
		isLogin: false
	});
};

exports.about = function(req, res) {
	res.render('about', { 
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js' 
	});
}

exports.register = function(req, res) {
	res.render('register', {
		csrf: 'CSRF token here'
	});
}

exports.login = function(req, res) {
	res.render('login');
}