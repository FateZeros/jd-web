var person = require('../handlers/person');

module.exports = function(app) {
	/** 个人 -- 我的信息 **/
	app.get('/person/myInfo', person.myInfo);
}