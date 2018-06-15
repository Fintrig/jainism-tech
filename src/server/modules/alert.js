const request = require('request'),
	fs = require('fs'),
	path = require('path');

const templates = {
	// 'ethPrice': ''
};

module.exports = {

	init() {
		// templates.ethPrice = fs.readFileSync(path.join('src', 'server', 'data', 'email', 'ethPrice.hbs'), 'utf-8');
	},

	sendEmail(obj) {

		let body_type = 'html';
		if (Object.keys(obj.template_var).length != 0) {
			body_type = 'html_hbs_dynamic';
		}

		let payload = {
			secret: 'TMMwnAfc6B5FQb6rsVF5hXVTzeVweK',
			reply_to: obj.reply_to,
			to: obj.recipient,
			subject: obj.subject,
			from_email: obj.from_email,
			from_name: obj.from_name,
			body_data: templates[obj.template],
			body_type: body_type,
			service_name: 'BSE_NOTIFIER',
			context: JSON.stringify(obj.template_var)
		};

		request.post('https://email.sowmayjain.com/send-email', {
			form: payload,
			headers: {
				contentType: 'application/x-www-form-urlencoded'
			}
		}, (err, httpResponse) => {
			if (err) {
				console.error(`error in sending mail request. ${err}`);
			} else {
				if (httpResponse.statusCode != 200) {
					console.error(`Error in sending mail. Status code ${httpResponse.statusCode}`);
				} else {
					console.log('Email sent to', obj.recipient, '|', obj.subject, httpResponse.body);
				}
			}
		});
	},

	// to is a phone number with international code prefix. Example +917894632165
	sendText(to, type, message) {

		let payload = {
			secret: 'TMMwnAfc6B5FQb6rsVF5hXVTzeVweK',
			to: to,
			message: message,
			type: type,
			service_name: 'BSE_NOTIFIER'
		};

		request.post('https://email.sowmayjain.com/send-text', {
			form: payload,
			headers: {
				contentType: 'application/x-www-form-urlencoded'
			}
		}, (err, httpResponse) => {
			if (err) {
				console.error(`error in sending push request. ${err}`);
			} else {
				if (httpResponse.statusCode != 200) {
					console.error(`Error in sending mail. Status code ${httpResponse.statusCode}`);
				} else {
					console.log('SMS sent to', to, httpResponse.body);
				}
			}
		});

	},

	sendPush(to, type, title, body) {

		if (type != 'link' && type != 'text') {
			return new Error('Invalid type');
		}

		let payload = {
			secret: 'TMMwnAfc6B5FQb6rsVF5hXVTzeVweK',
			to: to,
			title: title,
			message: body,
			message_type: type,
			service_name: 'BSE_NOTIFIER'
		};


		request.post('https://email.sowmayjain.com/push-notify', {
			form: payload,
			headers: {
				contentType: 'application/x-www-form-urlencoded'
			}
		}, (err, httpResponse) => {
			if (err) {
				console.error(`error in sending push request. ${err}`);
			} else {
				if (httpResponse.statusCode != 200) {
					console.error(`Error in sending mail. Status code ${httpResponse.statusCode}`);
				}  else {
					console.log('Push sent to', to, title, httpResponse.body);
				}
			}
		});
	}

};
