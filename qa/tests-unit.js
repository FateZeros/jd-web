// 功能小，不能做集成测试， 故单元测试。
var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortune cookie tests', function() {
	test('getFortune() should return a fortune', function() {
		expect(typeof fortune.getFortune() === 'stirng');
	})
})