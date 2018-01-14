
const app_handlers = {};

app_handlers.getStarted = (firstName) => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: '안녕하세요, 반가워요! Hey ' + firstName + '. I am here to quiz you to see how much you know about K-pop',
						buttons: [
							{
								type: 'postback',
								title: 'Start Quiz',
								payload: 'startQuiz'
							},
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


module.exports = app_handlers;