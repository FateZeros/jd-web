var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');

var fortune = require('./lib/fortune.js');

var app = express();

//设置端口
app.set('port', process.env.PORT || 1212);

//加载静态资源
app.use(express.static(path.join(__dirname, 'public'))); 

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
	console.log('Express start on http://localhost:' + app.get('port') + '...');
})