const Commands = require('../core/command');

module.exports = class Hint extends Commands {
	constructor(client) {
		super(client);
		this.cmd = 'hint';
		this.alias = 'hint';
		this.args =
      '[tipologia (Opzionale)] Messaggio di suggerimento.';
		this.example = `${client.conf.prefix}hint [nuovo canale] Creazione di un canale per l'argomento X`;
		this.description =
      'Suggerimenti per migliorare il server di CodersHub';
		this.timer = 0;
		this.access = [client._botSettings.rules.everyone];
        this.displayHelp = 1;
        this.client = client;
	}

	async execution(message, bot) {
        const id_author = message.author.id;
        const channelName = 'suggerimenti';
        let hintMessage = message.args;
        let hintCategory = '';
        
        if (hintMessage.indexOf('[', 0) == 0 && hintMessage.indexOf(']', 0) > 0) {
			console.log(hintMessage.indexOf('[', 0), '[');
			console.log(hintMessage.indexOf(']', 0), ']');
			hintCategory = hintMessage.substring(hintMessage.indexOf('[', 0) + 1, hintMessage.indexOf(']', 0));
			const hintCategoryLast = hintMessage.indexOf(']', 0);
			// Elimino la parte della categoria
			hintMessage = hintMessage.substr(hintCategoryLast + 1);
        }
        
        // Questo per togliere lo spazio dopo [tipologia]
        if (hintMessage.indexOf(' ', 0) == 0) {
			hintMessage = hintMessage.substr(1);
        }
        
        const channel = this.client.channels.cache.find(channel => channel.name === channelName);

        let resp_str = '';

		if (hintCategory) {
			resp_str = `Suggerimento per la categoria **${hintCategory}** condiviso da <@${id_author}>:`;
		}
		else {
			resp_str = `Suggerimento inviato da <@${id_author}>:`;
        }
        
		if (hintMessage.length < 1) {
			message.reply(' il messaggio inserito deve avere più di 1 carattere');
		}
		else {
            const messageToSend = await channel
				.send(resp_str + '\n' + hintMessage)
				.catch((e) => {
					console.log(e);
				});

            await messageToSend.react('👍');
            await messageToSend.react('👎');
            
			await message.delete();
		}

	}
};
