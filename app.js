'use strict';

// Imports dependencies and set up http server
const
		express = require('express'),
		bodyParser = require('body-parser'),
		app = express().use(bodyParser.json()), // creates express http server
		request = require('request'),
		admin = require("firebase-admin"),
		serviceAccount = require("./serviceAccountKey.json");

// Services to import
const
		apiHandlers = require('./api-handlers'),
		dbHandlers = require('./database-handlers'),
		appHandlers = require('./app-handlers.js');

// .env variables
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Firebase set up
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://kpop-trivia-bot.firebaseio.com"
});

// Get a database reference to our blog
const db = admin.database();

// Create paths for firebase
const ref = db.ref();
const usersRef = db.ref('users');
const scoreboardRef = db.ref('scoreboard');

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

	let firstName;
	let lastName;
	let profilePic;



	// Get user profile from facebook api
	apiHandlers.getUserProfile(sender_psid).then((data) => {
		let parsedObject = JSON.parse(data);

		firstName = parsedObject.first_name;
		lastName = parsedObject.last_name;
		profilePic = parsedObject.profile_pic;

		// Do a database scan and pull all users.

		// If sender_psid does not exist in database, create add a new user.
		dbHandlers.addUser(usersRef, sender_psid, firstName, lastName, profilePic, Date.now());

		dbHandlers.addScore(scoreboardRef, 30231, 50);
		dbHandlers.addScore(scoreboardRef, 42323, 70);
		dbHandlers.addScore(scoreboardRef, 1231, 500);
		// If sender_psid does exist, bring up its previous score.

		// Then user flow...
	}).then(() => {


		console.log("received message");
		console.log(received_message);
		if (received_message.payload == "Get Started") {

			response = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [
							{
								"title": firstName + ' ' + lastName,
								"subtitle": 'You look like shit today',
								"image_url": profilePic
							}
						]
					}
				}
			}
		}

		// Send message after promise
		callSendAPI(sender_psid, response);
	});
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response;

	// Get the payload for the postback
	let payload = received_postback.payload;

	if (payload === 'get_started') {
		response = appHandlers.getStarted();
	}



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