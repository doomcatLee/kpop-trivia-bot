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
		appHandlers = require('./app-handlers.js'),
		questionHandlers = require('./question-handlers.js');

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
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response;

	// Get the payload for the postback
	let payload = received_postback.payload;
	console.log(payload)

	// Strip out -correct and -incorrect from string if it starts with 'question' so it goes back to switch
	// Add score to firebase if payload has 'correct' string.
	if (payload.includes('question') || payload.includes('End')) {
		// Grab the fire item in the array from /filterPayload and assign to payload string.
		payload = dbHandlers.filterPayload(usersRef, payload, sender_psid);
	}

	// User question flow starts here
	switch (payload) {
			// Get started here
		case 'get_started':
			// dbHandlers.setNewUser(usersRef, '1234Test', 'john', 'dork', 'profilePic', Date.now(), 0);

			apiHandlers.getUserProfile(sender_psid).then((data) => {
				const firstName = JSON.parse(data).first_name;
				const lastName = JSON.parse(data).last_name;
				const profilePic = JSON.parse(data).profile_pic;

				// Trigger, whether to add user to firebase or not.
				// This has to be true in order for payload proccess to not crash on line 146 if.
				let userNoExists = true;

				// Grab ref and loop through users ref and find userID.
				usersRef.once("value", function (snapshot) {
					try {
						snapshot.forEach(function (snapshot) {
							if (snapshot.val().userID === sender_psid) {
								console.log('User exists in firebase');
								userNoExists = false;
								return;
							}
						});
					} catch (e) {
						console.log(e);
					}
				});

				if (!userNoExists) {
					dbHandlers.setNewUser(usersRef, sender_psid, firstName, lastName, profilePic, Date.now(), 0);
				}

				// Call getStarted method
				response = appHandlers.getStarted(firstName);

				// Call the api
				callSendAPI(sender_psid, response);
			});
			break;

			// Start Quiz here
		case 'start_quiz':
			response = questionHandlers.question1();

			// Call the api
			callSendAPI(sender_psid, response);
			break;

		case 'question2':
			response = questionHandlers.question2();

			// Call the api
			callSendAPI(sender_psid, response);
			break;

		case 'question3':
			response = questionHandlers.question3();

			// Call the api
			callSendAPI(sender_psid, response);
			break;

		case 'question4':
			response = questionHandlers.question4();

			// Call the api
			callSendAPI(sender_psid, response);
			break;

		case 'question5':
			response = questionHandlers.questionEnd();

			// Call the api
			callSendAPI(sender_psid, response);
			break;

		case 'End':
			// Show them the score board!
			console.log('got to End');
			let userObject = dbHandlers.findUserObject(usersRef, sender_psid);
			response = questionHandlers.displayScoreboard(userObject);
			callSendAPI(sender_psid, response);
	}

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

	dbHandlers.findUserObject(usersRef, sender_psid).then((snapshot) => {
		console.log('g spot')
		console.log('response')
		response = questionHandlers.displayScoreboard(snapshot);
	});



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