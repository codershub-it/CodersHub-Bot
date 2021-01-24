const Commands = require('../core/command')

module.exports = class EmbedExemple extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'embed_example'
    this.alias = 'emex'
    this.args = ''
    this.example = ''
    this.description = 'Scarica il file di esempio .json per creare un embed'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    const id_author = message.author.id
    message.channel
      .send(`<@${id_author}> questo è il file di esempio:`, {
        files: ['./static/example_embed.json'],
      })
      .catch((e) => {
        console.log(e)
      })
  }
}
