
const db_handlers = {};

db_handlers.setNewUser = (dbRef, userID, firstName, lastName, profilePic, timeStamp, gameScore) => {
	dbRef.push().set({
		userID: userID,
		profilePic: profilePic,
		firstName: firstName,
		lastName: lastName,
		gameScore: 0,
		timeStamp: timeStamp
	});
};

db_handlers.addScore = (dbRef, firebaseID, score) => {
	dbRef.child(firebaseID)
			.child('gameScore')
			.set(score);
};



db_handlers.filterPayload = (dbRef, payload, userID) => {

	// Strip out -correct and -incorrect from string if it starts with 'question' so it goes back to switch
	let array;
	array = payload.split('-');

	// Is it the question correct?
	if (array[1] === 'correct') {
		console.log('question correct!')
		dbRef.once("value", function (snapshot) {
			try {
				snapshot.forEach(function (snapshot) {
					if (snapshot.val().userID === userID) {
						// Retreive gameScore in firebase
						const previousScore = snapshot.val().gameScore;
						// Get pushed ID key
						const firebaseID = snapshot.key;
						console.log()

						// Add score and set to firebase.
						db_handlers.addScore(dbRef, firebaseID, previousScore + 1);
						return;
					}
				});
			} catch (e) {
				console.log(e);
			}
		});
	}

	// 'question#'
	return array[0];
};


// This method retreives user ojbect in firebase via facebook userID.
db_handlers.findUserObject = (usersRef, userID) => {
	usersRef.once("value", function (snapshot) {
		try {
			snapshot.forEach(function (snapshot) {
				if (snapshot.val().userID === userID) {
					return snapshot.val();
				}
			});
		} catch (e) {
			console.log(e);
		}
	});
};

module.exports = db_handlers;