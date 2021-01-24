const Commands = require('../core/command')
const numberToEmoji = require('../core/utility/numberToEmoji')

module.exports = class Poll extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'poll'
    this.alias = 'po'
    this.args = '[domanda tra doppie virgolette] ...[risposte tra doppie virgolette]'
    this.example = `${client.conf.prefix}pull "che tempo fa oggi?" "bello" "brutto"`
    this.description = 'Questo comando serve a creare dei sondaggi'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 0
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message, bot) {
    // Estrapolo i componenti dal testo
    const arg = message.args.match(/"(.*?)"/g)

    // Verifico che ci sia la domanda o con le risposte
    if (!arg) message.reply(' devi scrivere almeno una domanda e delle risposte')

    const question_string = arg[0].replace(/"/g, '')
    arg.shift()

    if (question_string) {
      if (arg && arg.length > 0 && arg.length < 11) {
        const embed = new bot._botMessageEmbed()
        let msg = ''

        Array.from(arg).forEach((answer, i) => {
          msg += `${numberToEmoji.toEmoji(i)} ${answer.replace(/"/g, '')}\n`
        })

        embed.setColor('RANDOM')
        embed.setTitle(question_string)
        embed.setDescription(msg)
        embed.setThumbnail(
          'https://media1.tenor.com/images/0edd53dd2110147b786329c2e24fb1d0/tenor.gif',
        )

        const queueEmbed = await message.channel.send({ embed })

        for (const answer of Array.from(arg)) {
          const i = Array.from(arg).indexOf(answer)
          await queueEmbed.react(numberToEmoji.toEmoji(i))
        }
      }

      console.log(arg)
    }
  }
}
