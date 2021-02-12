const Commands = require('../../core/command')

module.exports = class MyNote extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'myNote'
    this.alias = 'mynote'
    this.args = 'inserisci la nota (Massimo 60 caratteri)'
    this.example = `${client.conf.prefix}myNote Qui si parla di Angular e delle sue problematiche`
    this.description =
      'Questo comando serve a salvare una nota di un messaggio interessante così da mantenere' +
      'una traccia di tutti i messaggi importanti questa nota è proprietaria solo di chi ha lanciato il comando'
    this.timer = 0
    this.access = []
    this.displayHelp = 1
    this.myNoteModel = note
    this.client = client
  }

  async execution(message) {
    // Verifico se il c'è un messaggio allegato
    if (!message.reference) {
      message
        .reply('Il comando deve essere inviato come risposta ad un messaggio già scritto')
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Estraggo i dati del messaggio allegato
    if (
      !message.reference.channelID ||
      !message.reference.guildID ||
      !message.reference.messageID
    ) {
      message
        .reply('Mi dispiace ma qualcosa è andato storto, contatta un amministratore del server')
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Estraggo la nota
    const args = message.args
    if (!message.args) {
      message
        .reply('Mi dispiace ma qualcosa è andato storto, contatta un amministratore del server')
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    if (message.args.length >= 60) {
      message
        .reply('La nota deve essere di massimo 60 caratteri')
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Verifico se la nota è già presente
    const presence = await this.myNoteModel
      .findOne({ message_id: message.reference.messageID })
      .exec()
    if (presence) {
      message
        .reply('Il messaggio è già stato inserito nelle note.')
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Provo ad inserirlo in mongo
    try {
      const newModel = this.myNoteModel({
        guild_id: message.reference.guildID,
        channel_id: message.reference.channelID,
        message_id: message.reference.messageID,
        author_id: message.author.id,
        note: args,
      })
      const resp = await newModel.save()
      // In base se è un componente dello staff
      message
        .reply(
          `Nota aggiunta con successo per il canale <#${resp.channel_id}>!\nNota: ${resp.note}`,
        )
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
    } catch (e) {
      console.log(e)
      message.reply('Purtroppo non è stato possibile aggiungere la nota..')
      message.delete()
    }
  }
}
