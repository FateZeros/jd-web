//发送邮件功能
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(credentials) {
	var mailTransport = nodemailer.createTransport(smtpTransport({
		service: 'QQ',
		auth: {
			user: credentials.QQmail.user,
			pass: credentials.QQmail.password
		}
	}))

	var from = ' "YJF" <490293266@qq.com>';
	var errorRecipient = '490293266@qq.com';

	return {
		send: function(to, subj, body) {
			mailTransport.sendMail({
				from: from,
				to: to,
				subject: subj,
				html: body,
				generateTextFromHtml: true
			}, function(err) {
				if (err) console.error('邮件未送达:' + err)
			})
		},
		emailError: function(message, filename, exception) {
			var body = '<h1>Meadowlark Travel Site Error</h1>' + 
								'message: <br><pre>' + message + '</pre><br>';
			if(exception) {
				body += 'exception: <br><pre>' + exception + '</pre><br>';
			}
			if (filename) {
				body += 'filename: <br><pre>' + filename + '</pre><br>';
			}

			mailTransport.sendMail({
				from: from,
				to: errorRecipient,
				subject: 'Meadowlark Travel Site Error',
				html: body,
				generateTextFromHtml: true
			}, function(err) {
				if(err) console.error('邮件未送达:' + err)
			})
		}
	}
}