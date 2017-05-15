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

var formidable = require('formidable');
// 上传
var jqupload = require('jquery-file-upload-middleware');

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

// app.engine('.hbs', exphbs({ 
// 	defaultLayout: 'main', 
// 	extname: '.hbs',
// 	helpers: {
// 		section: function(name, options) {
// 			console.log(name, options)
// 			if (!this._sections) this._section = {};
// 			this._sections[name] = options.fn(this);
// 			return null
// 		}
// 	}}));
// app.set('view engine', '.hbs');
// set up handlebars view engine
var handlebars = exphbs.create({
    defaultLayout:'main',
    extname: '.hbs',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1'; // 测试页面
	next();
})

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weatherContext = weather.getWeatherData();
	next();
});

// jQuery File Upload endpoint middleware
app.use('/upload', function(req, res, next){
  var now = Date.now();
  jqupload.fileHandler({
    uploadDir: function(){
      return __dirname + '/public/uploads/' + now;
    },
    uploadUrl: function(){
      return '/uploads/' + now;
    }
  })(req, res, next);
});

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
})

/*** 页面路由 END ***/

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