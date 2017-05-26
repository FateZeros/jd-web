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

var mongoose = require('mongoose');
var User = require('./models/user.js');

// 日志
var morgan = require('morgan');
var expLogger = require('express-logger');

var formidable = require('formidable');

var fs = require('fs');
// 上传
var jqupload = require('jquery-file-upload-middleware');
var Weather = require('./lib/weather.js');
// console.log(weather.getWeatherData());

var app = express();

//设置端口
app.set('port', process.env.PORT || 1212);

//加载静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 处理ajax 表单请求
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
// set up handlebars view engine
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1'; // 测试页面
	next();
})

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {};
	var uid = credentials.weatherApi.uid;
	var key = credentials.weatherApi.secretKey;
	var location = 'beijing';
	var argv = require('optimist').default('l', location).argv
	var weatherApi = new Weather(uid, key);
	weatherApi.getWeatherNow(argv.l).then(function(data) {
	  // console.log(JSON.stringify(data, null, 4));
	  var weatherNow = data.results[0];
	  // console.log(weatherNow);
	  // res.locals.partials.weatherContext = weatherApi.getWeatherNow();
	  res.locals.partials.weatherContext = weatherNow;
	}).catch(function(err) {
	  console.log(err.error.status);
	});
	next();
});

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


// 组织路由
require('./routes')(app);
// 自动化渲染视图
// var autoViews = {}
// app.use(function(req, res, next){
//   var path = req.path.toLowerCase();  
//   // check cache; if it's there, render the view
//   if(autoViews[path]) return res.render(autoViews[path]);
//   // if it's not in the cache, see if there's
//   // a .handlebars file that matches
//   if(fs.existsSync(__dirname + '/views' + path + '.hbs')){
//       autoViews[path] = path.replace(/^\//, '');
//       return res.render(autoViews[path]);
//   }
//   // no view found; pass on to 404 handler
//   next();
// });

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
});