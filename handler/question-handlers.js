
const question_handlers = {};

question_handlers.question1 = () => {

	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'Who is this group?',
						image_url: 'http://kpopconcerts.com/wp-content/uploads/2012/01/BEAST_Feature.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'Beast',
								payload: 'question2-correct'
							},
							{
								type: 'postback',
								title: '2ne1',
								payload: 'question2-incorrect'
							},
							{
								type: 'postback',
								title: 'apink',
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
						title: 'Who is this group2?',
						image_url: 'http://kpopconcerts.com/wp-content/uploads/2012/01/BEAST_Feature.jpg',
						buttons: [
							{
								type: 'postback',
								title: 'Beast',
								payload: 'question3-incorrect'
							},
							{
								type: 'postback',
								title: '2ne1',
								payload: 'question3-correct'
							},
							{
								type: 'postback',
								title: 'apink',
								payload: 'question3-incorrect'
							}
						]
					}
				]
			}
		}
	};
};

module.exports = question_handlers;