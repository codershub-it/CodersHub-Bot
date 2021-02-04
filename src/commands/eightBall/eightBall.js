const Commands = require('../../core/command')

module.exports = class EightBall extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'PallaOtto'
    this.alias = 'pallaotto'
    this.args = ''
    this.example = `${client.conf.prefix}PallaOtto Oggi riuscirò a fare quello?`
    this.description = 'La palla della fortuna 🚀'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    ;(this.displayHelp = 1), (this.client = client)
  }

  async execution(message) {
    const arg = message.args.match(/.+\?/g)
    if (!arg) {
      return message.reply('devi scrivere almeno una domanda')
    }
    const answer = this.resp()
    const embed = new this.client._botMessageEmbed()
      .setTitle('🎱 La palla dice...')
      .setColor('RANDOM')
      .setDescription('' + answer + '')
    message.channel.send({ embed })
  }

  resp() {
    const id = Math.floor(Math.random() * 20) + 1
    if (id == 1) {
      return 'Per quanto posso vedere, sì'
    } else if (id == 2) {
      return 'È certo'
    } else if (id == 3) {
      return 'È decisamente così'
    } else if (id == 4) {
      return 'Molto probabilmente'
    } else if (id == 5) {
      return 'Le prospettive sono buone'
    } else if (id == 6) {
      return 'Le mie fonti indicano di sì'
    } else if (id == 7) {
      return 'Senza alcun dubbio'
    } else if (id == 8) {
      return 'Sì'
    } else if (id == 9) {
      return 'Sì, senza dubbio'
    } else if (id == 10) {
      return 'Ci puoi contare'
    } else if (id == 11) {
      return 'È difficile rispondere, prova di nuovo'
    } else if (id == 12) {
      return 'Rifai la domanda più tardi'
    } else if (id == 13) {
      return 'Meglio non risponderti adesso'
    } else if (id == 14) {
      return 'Non posso predirlo ora'
    } else if (id == 15) {
      return 'Concentrati e rifai la domanda'
    } else if (id == 16) {
      return 'Non ci contare'
    } else if (id == 17) {
      return 'La mia risposta è no'
    } else if (id == 18) {
      return 'Le mie fonti dicono di no'
    } else if (id == 19) {
      return 'Le prospettive non sono buone'
    } else if (id == 20) {
      return 'Molto incerto'
    } else {
      return 'Mi puoi rifare la domanda, non ho capito..'
    }
  }
}
