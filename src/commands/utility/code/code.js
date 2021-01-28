const Commands = require('../../../core/command')

module.exports = class Code extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'code'
    this.alias = 'co'
    this.args = '[tipo linguaggio(Opzionale)] inserisci il codice...'
    this.example = `${client.conf.prefix}code [javascript] var idea = 3`
    this.description =
      'Utilizza questo comando per condividere il tuo codice nel CodersHub.\n' +
      'Il tipo di linguaggio deve essere inserito tra parentesi quadre (es:[php]) prima del tuo codice.\n\n' +
      '**Attenzione** il carattere ` (apostrofo rovesciato) verrà sostituito con §'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
  }

  async execution(message) {
    const id_author = message.author.id

    // Estrapolo gli elementi tra []
    const estract_obj = this.estractFromSquareBrackets(message.args)
    let code = estract_obj.txt
    const lang = estract_obj.squareValue

    // Escape del carattere ` con §
    code = code.replace(/`/g, '§')

    // Questo per togliere lo spazio dopo [lang]
    if (code.indexOf(' ', 0) == 0) {
      code = code.substr(1)
    }

    let resp_str = ''

    if (lang) {
      resp_str = `Codice **${lang}** condiviso da <@${id_author}>:`
    } else {
      resp_str = `Codice condiviso da <@${id_author}>:`
    }
    if (code.length < 1) {
      message.reply(' il codice inserito deve avere più di 1 carattere')
    } else {
      message.channel.send(resp_str + '\n```' + lang + '\n' + code + '```').catch((e) => {
        console.log(e)
      })
      await message.delete()
    }
  }
}
