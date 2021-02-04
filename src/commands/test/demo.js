const Commands = require('../../core/command')

module.exports = class Demo extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'demo'
    this.alias = 'dem'
    this.args = ''
    this.example = ''
    this.description = ''
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 0
    this.client = client
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message) {
    console.log(message)
    message.reply('Demo')
  }
}
