const Commands = require('../core/command')
const numberToEmoji = require('../core/utility/numberToEmoji')

module.exports = class Poll extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'sondaggio'
    this.alias = 'poll'
    this.args =
      '[domanda tra doppie virgolette] ...[risposte tra doppie virgolette (opzionali) massimo 10]'
    this.example = `${client.conf.prefix}sondaggio "che tempo fa oggi?" "bello" "brutto"`
    this.description = 'Questo comando serve a creare dei sondaggi'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message, bot) {
    const arg = message.args.match(/"(.*?)"/g)
    if (!arg) {
      message.reply(' devi scrivere almeno una domanda e delle risposte tra doppie virgolette')
      return
    }
    const question_string = arg[0].replace(/"/g, '')
    if (question_string.length < 20) {
      message.reply(' devi scrivere almeno una domanda da 20 caratteri')
      return
    }
    // Elimino il primo array che è la domanda
    arg.shift()
    if (question_string) {
      if (arg && arg.length > 0 && arg.length < 11) {
        const emb = new bot._botMessageEmbed()
        let msg = `**Domanda proposta da <@${message.author.id}>**\n${question_string}\n`
        msg += '**-- Risposte --**\n'
        Array.from(arg).forEach((answer, i) => {
          msg += `${numberToEmoji.toEmoji(i)} ${answer.replace(/"/g, '')}\n`
        })
        emb.setColor('RANDOM')
        emb.setDescription(msg)
        const queueEmbed = await message.channel.send(emb)
        for (let i = 0; i < arg.length; i++) {
          await queueEmbed.react(numberToEmoji.toEmoji(i))
        }
        await message.delete()
      } else {
        const emb = new bot._botMessageEmbed()
        const msg = `-- **Domanda proposta da <@${message.author.id}>** --\n${question_string}\n`
        emb.setDescription(msg)
        emb.setColor('RANDOM')
        emb.setTimestamp()
        const messageToSend = await message.channel.send(emb).catch((e) => {
          console.log(e)
        })
        await messageToSend.react('👍')
        await messageToSend.react('👎')
        await message.delete()
      }
    }
  }
}
