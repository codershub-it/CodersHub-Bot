const Commands = require('../../core/command')

module.exports = class DelNote extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'delNote'
    this.alias = 'delnote'
    this.args = '[id_nota]'
    this.example = `${client.conf.prefix}delNote 00000000000`
    this.description = 'Questo comando serve ad eliminare una nota'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Moderatore,
      client._botSettings.rules.Collaboratore,
    ]
    this.displayHelp = 1
    this.modelNote = note
    this.client = client
  }

  async execution(message) {
    const args = message.args
    if (!message.args) {
      message.reply(' devi inserire il codice di riferimento della note')
      message.delete()
      return
    }
    if (message.args.length < 24) {
      message.reply(" l'id della nota deve avere 24 caratteri")
      message.delete()
      return
    }
    try {
      const resp = await this.modelNote.findByIdAndDelete({ _id: args })
      message.reply(` nota eliminata! ID: ${resp._id}`)
      message.delete()
    } catch (e) {
      console.log(e)
      message.reply(' non sono riuscito a eliminare la nota, questa nota non esiste')
      message.delete()
    }
  }
}
