const Commands = require('../core/command')

module.exports = class Fatman extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'fatman'
    this.alias = 'ftm'
    this.args = ''
    this.example = ''
    this.description = 'Elimina 100 messaggi un colpo solo'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    await message.reply(' la bomba è stata lanciata')
    this.wait(1000)
    await message.reply(' 3 :skull_crossbones: ')
    this.wait(1000)
    await message.reply(' 2 :thinking: ')
    this.wait(1000)
    await message.reply(' 1 :scream: ')
    this.wait(1000)
    async function clear() {
      message.delete()
      const fetched = await message.channel.messages.fetch({ limit: 99 })
      message.channel.bulkDelete(fetched).catch((e) => {
        console.log(e)
      })
    }
    await clear()
  }

  /**
   * Attende un x tempo in ms
   * @param ms
   */
  wait(ms) {
    const start = new Date().getTime()
    let end = start
    while (end < start + ms) {
      end = new Date().getTime()
    }
  }
}
