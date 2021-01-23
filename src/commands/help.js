const Commands = require('../core/command');

module.exports = class help extends Commands {

	constructor(client) {
		super(client);
		this.cmd = 'help';
		this.alias = 'h';
		this.args = `${ client.conf.prefix }help embed`;
		this.example = `${ client.conf.prefix }help o ${ client.conf.prefix }help [nome del comando]`;
		this.description = 'Da solo usa questo comando per avere la lista tutti i comandi. Aggiungendo il nome del comando hai la descrizione dettagliata';
		this.timer = 0;
		this.access = [client._botSettings.rules.everyone];
		this.displayHelp = 1;
	}

	async execution(message, bot) {
		const nomeComando = message.args;
		let msg = '';
		// Estrapola tutti i comandi disponibili
		const commands = bot._botCommands;
		if (!nomeComando) {
			msg += `\n**${bot.conf.prefix}${commands['help'].cmd} [scrivi il nome del comando]**\n${commands['help'].description}\n`;
			msg += '\n';
			msg += '**Lista comandi disponibili:**\n';
			msg += '```';
			Object.entries(commands).filter(([, fn]) => {
				if (fn.displayHelp === 1) {
					if (message.member.roles.cache.some(itm => fn.access.includes(itm.name))) {
						if (fn.cmd !== 'help') {
							msg += bot.conf.prefix + fn.cmd + ' ';
						}
					}
				}
			});
			msg += '```';
		}
		Object.entries(commands).filter(([, fn]) => {
			if (fn.displayHelp == 1 && (fn.cmd == nomeComando || fn.alias == nomeComando)) {
				if (message.member.roles.cache.some(itm => fn.access.includes(itm.name))) {
					msg += `\nComando: **${bot.conf.prefix}${fn.cmd}**\nAlias: **${bot.conf.prefix}${fn.alias}**\n`;
					if (fn.args) {
						msg += `\n**Parametri aggiuntivi: **\n${fn.args}\n`;
					}
					if (fn.description) {
						msg += `\n**Descrizione: **\n${fn.description}\n`;
					}
					if (fn.example) {
						msg += `\n**Esempio: **\n${fn.example}\n`;
					}
				}
			}
		});
		const emb = new bot._botMessageEmbed();
		if (!nomeComando) {
			emb.setTitle('Ciao! Questo è il bot ufficiale di CodersHub');
		}
		else {
			emb.setTitle('Dettaglio comando');
		}
		emb.setDescription(msg);
		emb.setColor('RANDOM');
		emb.setThumbnail('https://media1.tenor.com/images/0edd53dd2110147b786329c2e24fb1d0/tenor.gif');
		message.channel.send(emb).catch((e) => {
			console.log(e);
		});
	}
};