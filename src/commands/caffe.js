const Commands = require('../core/command');

module.exports = class Caffe extends Commands {

	constructor(client) {
		super(client);
		this.cmd = 'caffè';
		this.alias = 'ca';
		this.args = '[@nomeutente (Opzionale)] Se vuoi offrire il caffè ad un\'altra persona';
		this.example = `${ client.conf.prefix }caffè @nomeutente`;
		this.description = 'Ideala per bere un caffè in compagnia o offerto dal bot 👊🏻';
		this.timer = 0;
		this.access = [client._botSettings.rules.everyone];
		this.displayHelp = 1;
	}

	async execution(message, bot) {
		const id_author = message.author.id;
		if (message.mentions.members.first()) {
			const id_mention = message.mentions.members.first().id;
			message.channel.send(`Ciao <@${id_mention}> sei fortunato, l'utente <@${id_author}> ti ha offerto un :coffee:`).catch((e) => {
				console.log(e);
			});
		}
		else {
			message.channel.send(`Ciao <@${id_author}> eccoti un buon :coffee:`).catch((e) => {
				console.log(e);
			});
		}
	}
};