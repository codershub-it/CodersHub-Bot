require('dotenv').config();

module.exports = {
	/**
     * Tipologie di utenti
     */
	rules: {
		'everyone': '@everyone',
		'Admin': 'Admin',
		'Moderatore': 'Moderatore',
		'Collaboratore': 'Collaboratore',
	},
	/**
     * Tipologia di task
     */
	taskType: {
		'AddReaction': 'AddReaction',
		'RemoveReaction': 'RemoveReaction',
		'AddMessage': 'AddMessage',
	},
};