
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


module.exports = db_handlers;