const Commands = require('../core/command')

module.exports = class Demo extends Commands {
  constructor(client) {
    super(client)
    this.cmd = ''
    this.alias = ''
    this.args = ''
    this.example = ''
    this.description = ''
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 0
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message, bot) {
    message.reply('Demo')
  }
}
