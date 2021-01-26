const Commands = require('../../../core/command')

module.exports = class AddNote extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'addNote'
    this.alias = 'addnote'
    this.args = 'inserisci la nota'
    this.example = `${client.conf.prefix}addNote Qui si parla di Angular e delle sue problematiche`
    this.description =
      'Questo comando serve a salvare una nota di un messaggio interessante così da mantenere' +
      'una traccia di tutti i messaggi importanti, tutti gli utenti possono aggiungere note sarà cura dello' +
      'staff approvare la note'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.modelNote = require('../../../core/model/note')
  }

  async execution(message) {
    if (!message.reference) {
      message.reply(' Il comando deve essere inviato come risposta ad un messaggio già scritto')
      return
    }

    if (
      !message.reference.channelID ||
      !message.reference.guildID ||
      !message.reference.messageID
    ) {
      message.reply(
        ' mi dispiace ma qualcosa è andato storto, contatta un amministratore del server',
      )
      return
    }

    const args = message.args
    if (!message.args) {
      message.reply(' devi scrivere anche una nota')
      return
    }

    const obData = {
      guild_id: message.reference.guildID,
      channel_id: message.reference.channelID,
      message_id: message.reference.messageID,
      author_id: message.author.id,
      note: args,
      nickname: true,
    }

    try {
      const newModel = this.modelNote(obData)
      const resp = await newModel.save()
      message.reply(` nota aggiunta con successo! ID: ${resp._id}`)
    } catch (e) {
      console.log(e)
      message.reply(' purtroppo non è stato possibile aggiungere la nota..')
    }
  }
}
