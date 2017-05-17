var main = require('../handlers/main');

module.exports = function(app) {
	/*** 页面路由 Start ***/
	app.get('/', main.home);

	app.get('/about', main.about);

	/** 注册 模块 **/
	app.get('/register', main.register);


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