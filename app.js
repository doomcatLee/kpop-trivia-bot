'use strict';

// Imports dependencies and set up http server
const
		express = require('express'),
		bodyParser = require('body-parser'),
		app = express().use(bodyParser.json()), // creates express http server
		request = require('request');

// .env variables
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

	let body = req.body;

// Checks this is an event from a page subscription
	if (body.object === 'page') {

		// Iterates over each entry - there may be multiple if batched
		body.entry.forEach(function (entry) {

			// This is the message object
			let webhook_event = entry.messaging[0];
			let sender_psid = webhook_event.sender.id;

			// Check if the event is a message or postback and
			// pass the event to the appropriate handler function
			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
		});

		// Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED');
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}

});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

// Checks if a token and mode is in the query string of the request
	if (mode && token) {

		// Checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {

			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);

		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});


// Handles messages events
function handleMessage(sender_psid, received_message) {

	let response;

	// Check messages contains text
	if (received_message.text) {
		response = {
			"text": `You sent the message: "${received_message.text}". Now send me an image!`
		}

	}
	// If messages contain attachments
	else if (received_message.attachments) {

		// Gets the URL of the message attachment
		let attachment_url = received_message.attachments[0].payload.url;
		console.log(attachment_url);
	}

	callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response;
	console.log(received_postback);

	// Get the payload for the postback
	let payload = received_postback.payload;

// 	if (payload === 'searchVehicle') {
// 		response = messageHandler.searchVehicle();
// 	} else if (payload === 'scheduleAppointment') {
// 		response = messageHandler.scheduleAppointment();
// 	} else if (payload === 'findToyota') {
// 		response = messageHandler.findToyota();
// 	}


// 	if (payload === 'sedan') {
// 		response = messageHandler.findTopSedans();
// 	}

	callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

	// Construct the message body
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	};

	// Send the HTTP request to the Messenger Platform
	request({
		"uri": "https://graph.facebook.com/v2.6/me/messages",
		"qs": {"access_token": process.env.PAGE_ACCESS_TOKEN},
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log('message sent!')
		} else {
			console.error("Unable to send message:" + err);
		}
	});
}