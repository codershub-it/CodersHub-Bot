const Commands = require('../core/command')

module.exports = class Hint extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'hint'
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
    const hintChannel = this.client.channels.cache.find(
      (channel) => channel.name === 'suggerimenti',
    )
    const hintMessage = message.args

    if (hintMessage.length < 5) {
      message.reply(' il messaggio inserito deve avere più di 5 caratteri')
    } else {
      const emb = new bot._botMessageEmbed()
      emb.setTitle(
        `Nuovo suggerimento da ${
          message.author.username ? message.author.username : message.author.name
        }`,
      )
      emb.setDescription(hintMessage)
      emb.setColor('RANDOM')
      emb.setTimestamp()
      const messageToSend = await hintChannel.send(emb).catch((e) => {
        console.log(e)
      })
      await messageToSend.react('👍')
      await messageToSend.react('👎')

      message.reply(
        ' la proposta è stato inviata. Grazie per aver contribuito a migliorare la Community!',
      )
      await message.delete()
    }
  }
}
