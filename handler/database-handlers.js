
const db_handlers = {};

db_handlers.setNewUser = (dbRef, userID, firstName, lastName, profilePic) => {
	dbRef.set({
		userID: userID,
		firstName: firstName,
		lastName: lastName,
		score: 0
	});
};

db_handlers.addUser = (dbRef, userID, firstName, lastName, profilePic, timeStamp) => {
	dbRef.push().set({
		userID: userID,
		profilePic: profilePic,
		firstName: firstName,
		lastName: lastName,
		score: 0,
		timeStamp: timeStamp
	});
};

db_handlers.addScore = (dbRef, userID, score) => {
	dbRef.push().set({
		userID: userID,
		score: score
	});
};

db_handlers.filterPayload = (scoreboardRef, payload, userID, currentScore) => {
	// Strip out -correct and -incorrect from string if it starts with 'question' so it goes back to switch

	let array;
	array = payload.split('-');

	// Assign payload to the first value 'question2'
	payload = array[0];

	// Add score if second value is correct
	if (array[1] === 'correct') {
		db_handlers.addScore(scoreboardRef, userID, currentScore + 1);
	}

	return payload;

};


module.exports = db_handlers;