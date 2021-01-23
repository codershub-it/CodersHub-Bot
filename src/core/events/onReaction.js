/**
 * Monitora quando si toglie una emoji
 * @param client
 */
function reactionRemove(client) {
	client.on('raw', (raw) => {
		/**
     * Quando viene tolta una reazione
     */
		// if (raw.t === 'MESSAGE_REACTION_REMOVE') {
		// }
	});
}

/**
 * Monitora quando si aggiunge una emoji
 * @param client
 */
function reactionAdd(client) {
	client.on('raw', (raw) => {
		/**
     * Quando viene aggiunta una reazione
     */
		// if (raw.t === 'MESSAGE_REACTION_ADD') {
		// }
	});
}

/**
 * Init
 * @param client
 */
function init(client) {
	reactionAdd(client);
	reactionRemove(client);
}

module.exports = { init };
