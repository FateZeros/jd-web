// 跨页测试 document.referrer

var Browser = require('zombie'),
		assert = require('chai').assert;

var brower;

suite('Cross-Page Tests', function() {
	setup(function() {
		browser = new Browser();
	})

	test('requesting a group rate quote from the hood river tour page ' +
		'should populate the referrer field', function(done) {
			var referrer = 'http://localhost:1212/tours/hood-river';
			browser.visit(referrer, function() {
				browser.clickLink('.requestGroupRate', function() {
					// console.log(browser.location.href)
					// browser.field('referrer').value ==> '' ??
					assert(browser.field('referrer').value === referrer);
					// browser.assert.input('form input[name=referrer]', referrer);	
				});
				done(); //done 在clickLink操作之外。
			});
	});

	test('requesting a group rate from the oregon coast tour page ' +
		'should populate the referrer field', function(done) {
			var referrer = 'http://localhost:1212/tours/oregon-coast';
			browser.visit(referrer, function() {
				browser.clickLink('.requestGroupRate', function() {
					assert(browser.field('referrer').value === referrer);
				});
				done();
			});
	});

	test('visting the "request group rate" page directly should result ' + 
		'in an empty referrer field', function(done) {
			browser.visit('http://localhost:1212/tours/request-group-rate', function() {
				assert(browser.field('referrer').value === '');
			});
			done();
	});
})