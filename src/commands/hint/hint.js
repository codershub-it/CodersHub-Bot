const Commands = require('../../core/command')

module.exports = class Hint extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'proposta'
    this.alias = 'hint'
    this.args = ''
    this.example = `${client.conf.prefix}proposta creare un canale per discutere di nodejs e delle sue funzinoalità`
    this.description = 'Suggerimenti per migliorare il server di CodersHub'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.client = client
  }

  async execution(message) {
    const args = message.args
    const hintChannel = this.client.channels.cache.find(
      (channel) => channel.id === this.client._botSettings.channel.suggerimenti_id,
    )
    if (args.length > 20) {
      const emb = new this.client._botMessageEmbed()
      emb.setTitle(
        `Nuovo suggerimento da ${
          message.author.username ? message.author.username : message.author.name
        }`,
      )
      emb.setThumbnail(message.author.avatarURL())
      emb.setDescription(args)
      emb.setColor('RANDOM')
      emb.setTimestamp()
      const messageToSend = await hintChannel
        .send(`@everyone è arrivata una nuova proposta!`, emb)
        .catch((e) => {
          console.log(e)
        })
      await messageToSend.react('👍')
      await messageToSend.react('👎')
      await message.delete()
    } else {
      message.reply(' scrivi almeno un suggerimento da 20 lettere')
    }
  }
}
