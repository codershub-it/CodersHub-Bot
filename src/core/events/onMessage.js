/**
 * Estrapola e estende l'oggetto message aggiungendo cmd che è il comando usato e args sono gli argomenti dopo cmd
 * @param client
 * @param message
 * @returns {*}
 */
const extendMessage = (client, message) => {
	const _message = message;
	const cmd = message.content.substr(1, message.content.length).split(' ')[0];
	_message.cmd = cmd.toLowerCase();
	_message.args = message.content.replace(client.conf.prefix + cmd, '').trim();
	return _message;
};

/**
 * Legge i messaggi ricevuti e ne gestisce se sono comandi
 * @param message
 * @param client
 * @returns {*}
 */
function readMessage(message, client) {
	if (message.author.bot) return;

	// Aggiunge una reazione se menzionato
	if (message.mentions.has(client.user)) {
		message.react('😉').catch((e) => {
			console.log(e);
		});
	}

	if (message.content[0] !== client.conf.prefix) return;
	message = extendMessage(client, message);
	let x = 0;

	/**
     * Estraggo tutti i comandi inseriti, verifico il permesso e avvio il comando.
     */
	Object.entries(client._botCommands).forEach(([rif, cmd]) => {
		if (cmd.cmd === message.cmd || cmd.alias === message.cmd) {
			// Permesso di accesso al comando.
			const rules = cmd.access;
			if (!message.member.roles.cache.some(itm => rules.includes(itm.name))) {
				x++;
				return message.reply('mi dispiace ma non hai i permessi per inviare questo comando');
			}
			// Start command
			cmd.execution(message, client).catch((e) => {
				console.log(e);
			});
			x++;
		}
	});
	// Se non ci sono risposte positive
	if (x == 0) {
		const emb = new client._botMessageEmbed()
			.setTitle(`Hei ${message.author.username} sicuro di aver scritto giusto? :scream:`)
			.setColor('RANDOM')
			.setDescription(`Questo comando mi emoziona ma non so a cosa serva.. Usa **${client.conf.prefix}help** per vedere tutti i miei comandi :kissing_heart: `);
		message.channel.send(emb).catch((e) => {
			console.log(e);
		});
	}
}

/**
 * Inizializzatore della pagina
 * @param client
 */
function init(client) {
	client.on('message', (message) => {
		readMessage(message, client);
	});
}
module.exports = { init };