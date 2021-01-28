const Commands = require('../../core/command')

module.exports = class Say extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'Say'
    this.alias = 'say'
    this.args = 'La frase da far dire al bot al posto nostro'
    this.example = `${client.conf.prefix}say Hei! Che tempo fa oggi?`
    this.description = 'Questo comando il bot ripete quello che noi scriviamo'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Collaboratore,
      client._botSettings.rules.Moderatore,
    ]
    this.displayHelp = 1
  }

  async execution(message) {
    const sayMessage = message.args
    message.delete()
    message.channel.send(sayMessage)
  }
}
