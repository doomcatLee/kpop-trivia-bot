
const request = require('request');

function getUserProfile(sender_psid) {

	return new Promise((resolve, reject) => {
		// Send the HTTP request to the Messenger Platform
		request({
			"uri": "https://graph.facebook.com/v2.6/" + sender_psid,
			"qs": {"access_token": process.env.PAGE_ACCESS_TOKEN},
			"method": "GET",
		}, (err, res, body) => {
			if (!err) {
				// This is the user profile response
				resolve(body);
				reject("Failed");
			} else {
				console.error("Unable to send message:" + err);
			}
		});
	});
}

module.exports = {
	getUserProfile
};