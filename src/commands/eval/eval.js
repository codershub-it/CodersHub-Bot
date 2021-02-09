const Commands = require('../../core/command')

module.exports = class Eval extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'eval'
    this.alias = ''
    this.args = ''
    this.example = ''
    this.description = ''
    this.timer = 0
    this.access = [client._botSettings.rules.Admin]
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
    const run = eval(message.args)
    message.channel.send('```' + run + '```')
  }
}
