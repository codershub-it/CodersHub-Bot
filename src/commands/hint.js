const Commands = require('../core/command')

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

  async execution(message, bot) {
    const args = message.args
    const hintChannel = this.client.channels.cache.find(
      (channel) => channel.name === 'suggerimenti',
    )
    if (args.length > 20) {
      const emb = new bot._botMessageEmbed()
      emb.setTitle(
        `Nuovo suggerimento da ${
          message.author.username ? message.author.username : message.author.name
        }`,
      )
      emb.setThumbnail(message.author.avatarURL())
      emb.setDescription(args)
      emb.setColor('RANDOM')
      emb.setTimestamp()
      const messageToSend = await hintChannel.send(emb).catch((e) => {
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
