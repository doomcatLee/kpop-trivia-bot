

/**
 * Message that welcomes the user to the bot
 *
 * @param {string} apiUri - Hostname of the server.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const mainMenu = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'What would you like to do?',
						buttons: [
							{
								type: 'postback',
								title: 'Search for a vehicle',
								payload: 'searchVehicle'
							},
							{
								type: 'web_url',
								url: 'https://www.beavertontoyota.com/toyota-schedule-service',
								title: 'Schedule appointment'

							},
							{
								type: 'postback',
								title: 'Find your Toyota',
								payload: 'findToyota'
							}
						]
					}
				]
			}
		}
	};
};


const welcomeMessage = () => {
	return {
		"text": "Hey Alex! Welcome to Beaverton Toyota. I can sift through all our inventory in seconds to find the car you need or schedule you a vehicle service appointment."
	}
}

const searchVehicle = () => {
	return {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [
					{
						title: 'What kind of car are you looking for?',
						buttons: [
							{
								type: 'postback',
								title: 'Sedan',
								payload: 'sedan'
							},
							{
								type: 'postback',
								title: 'SUV',
								payload: 'suv'
							},
							{
								type: 'postback',
								title: 'Truck',
								payload: 'truck'
							}
						]
					}
				]
			}
		}
	}
}

const findTopSedans = () => {
	return {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "list",
				"top_element_style": "compact",
				"elements": [
					{
						"title": "2018 Camry XSE",
						"subtitle" : "$27,932",
						"image_url": "https://www.russauto.com/vehPhotos/15964/15964_01.jpg",
						"buttons": [{
							"title": "View",
							"type": "web_url",
							"url": "https://clearautoservices.xyz/vdp/4T1B61HK1JU047448"
						}]
					},
					{
						"title": "2018 Avalon Limited",
						"subtitle" : "$38,732",
						"image_url": "https://www.russauto.com/vehPhotos/14028/14028_01.jpg",
						"buttons": [{
							"title": "View",
							"type": "web_url",
							"url": "https://clearautoservices.xyz/vdp/4T1BD1EB6JU059976"
						}]
					},
					{
						"title": "2018 Corolla SE",
						"subtitle" : "$38,732",
						"image_url": "https://www.russauto.com/vehPhotos/16080/16080_01.jpg",
						"buttons": [{
							"title": "View",
							"type": "web_url",
							"url": "https://clearautoservices.xyz/vdp/2T1BURHE7JC022571"
						}]
					}
				]
			}
		}
	}
}


module.exports = {
	mainMenu,
	welcomeMessage,
	searchVehicle,
	findTopSedans
}


