var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
// 表单处理 中间件body-parser
var bodyParser = require('body-parser');
// Cookie
var cookieParser = require('cookie-parser');
var credentials = require('./credentials.js');
// Session
var session = require('express-session');
// Email
var emailService = require('./lib/email.js')(credentials);

// emailService.send('1031720197@qq.com', 'Hello Email', 'Hello');

// 日志
var morgan = require('morgan');
var expLogger = require('express-logger');

var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js');
// console.log(weather.getWeatherData());

var app = express();

//设置端口
app.set('port', process.env.PORT || 1212);

//加载静态资源
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

switch(app.get('env')) {
	case 'development':
		app.use(morgan('dev'));
		break;
	case 'production':
		app.use(expLogger({
			path: __dirname + '/log/requests.log'
		}));
		break;
}

app.use(cookieParser(credentials.cookieSecret));
app.use(session());

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1'; // 测试页面
	next();
})

/*** 页面路由 Start ***/
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	res.render('about', { 
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js' 
	});
})

app.get('/tours/hood-river', function(req, res) {
	res.render('tours/hood-river');
})

app.get('/tours/request-group-rate', function(req, res) {
	res.render('tours/request-group-rate');
})
/*** 页面路由 END ***/

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = weather.getWeatherData();
	next();
})

//定制404页面
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err, req, res, next) {
	console.log(err.stack);
	res.status(500);
	res.render('500');
})

app.listen(app.get('port'), function() {
	console.log('Express start in ' + app.get('env') +
		' mode on http://localhost:' + app.get('port') + '...');
})