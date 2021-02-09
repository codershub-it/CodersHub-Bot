const Commands = require('../../core/command')

module.exports = class Ping extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'ping'
    this.alias = 'pi'
    this.args = ''
    this.example = ''
    this.description = 'Mostra il tempo di risposta del Bot.'
    this.timer = 0
    this.access = []
    this.displayHelp = 1
    this.client = client
  }

  async execution(message) {
    const m = await message.channel.send('Ping?')
    return m
      .edit(
        `Pong! 🏓 Latenza server ${
          m.createdTimestamp - message.createdTimestamp
        }ms. Latenza API ${Math.round(this.client.ws.ping)}ms`,
      )
      .catch((e) => {
        console.log(e)
      })
  }
}
