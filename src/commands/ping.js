const Commands = require('../core/command')

module.exports = class Ping extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'ping'
    this.alias = 'pi'
    this.args = ''
    this.example = ''
    this.description = 'Mostra il tempo di risposta del Bot.'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    const m = await message.channel.send('Ping?')
    return m
      .edit(
        `Pong! 🏓 Latenza server ${
          m.createdTimestamp - message.createdTimestamp
        }ms. Latenza API ${Math.round(bot.ws.ping)}ms`,
      )
      .catch((e) => {
        console.log(e)
      })
  }
}
