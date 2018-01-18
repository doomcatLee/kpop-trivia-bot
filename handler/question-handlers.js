
const question_handlers = {};

question_handlers.question1 = () => {

	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Guess the group!',
						image_url: 'http://kpopconcerts.com/wp-content/uploads/2012/01/BEAST_Feature.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'MBLAQ',
								payload: 'question2-correct'
							},
							{
								type: 'postback',
								title: 'Beast/Highlight',
								payload: 'question2-incorrect'
							},
							{
								type: 'postback',
								title: 'SS501',
								payload: 'question2-incorrect'
							}
						]
					}
				]
			}
		}
	};
};


question_handlers.question2 = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Guess the group!',
						image_url: 'http://i.imgur.com/QW4lzj8.jpg',
						buttons: [
							{
								type: 'postback',
								title: '2PM',
								payload: 'question3-correct'
							},
							{
								type: 'postback',
								title: 'SHINee',
								payload: 'question3-incorrect'
							},
							{
								type: 'postback',
								title: 'CN Blue',
								payload: 'question3-incorrect'
							}
						]
					}
				]
			}
		}
	};
};


question_handlers.question3 = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Guess the group!',
						image_url: 'https://www.allkpop.com/upload/2016/10/af_org/MBLAQ_1477265275_af_org.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'MBLQ',
								payload: 'question4-correct'
							},
							{
								type: 'postback',
								title: '2ne1',
								payload: 'question4-incorrect'
							},
							{
								type: 'postback',
								title: 'apink',
								payload: 'question4-incorrect'
							}
						]
					}
				]
			}
		}
	};
};

question_handlers.question4 = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Guess the group!',
						image_url: 'https://i.imgur.com/9sFe4QK.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'Miss A',
								payload: 'question5-incorrect'
							},
							{
								type: 'postback',
								title: 'Sistar',
								payload: 'question5-incorrect'
							},
							{
								type: 'postback',
								title: 'Secret',
								payload: 'question5-correct'
							}
						]
					}
				]
			}
		}
	};
};

question_handlers.questionEnd = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Guess the group!',
						image_url: 'https://i.imgur.com/9sFe4QK.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'Miss A',
								payload: 'End-incorrect'
							},
							{
								type: 'postback',
								title: 'Sistar',
								payload: 'End-incorrect'
							},
							{
								type: 'postback',
								title: 'Secret',
								payload: 'End-correct'
							}
						]
					}
				]
			}
		}
	};
};

question_handlers.displayScoreboard = (userObject) => {
	let score = userObject.gameScore;
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'You scored' + score + ' points!',
						buttons: [
							{
								type: 'postback',
								title: 'View Scoreboard',
								payload: 'viewScoreboard'
							}
						]
					}
				]
			}
		}
	};
};

module.exports = question_handlers;