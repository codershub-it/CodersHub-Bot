const Commands = require('../../core/command')

module.exports = class Note extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'note'
    this.alias = 'Note'
    this.args = 'inserisci la nota (Massimo 60 caratteri)'
    this.example = `${client.conf.prefix}Note Qui si parla di Angular e delle sue problematiche`
    this.description =
      'Questo comando serve a salvare una nota di un messaggio interessante così da mantenere' +
      'una traccia di tutti i messaggi importanti, tutti gli utenti possono aggiungere note, sarà cura dello' +
      'staff approvare la note'
    this.timer = 0
    this.access = []
    this.displayHelp = 1
    this.modelNote = note
    this.client = client
  }

  async execution(message) {
    // Verifico se il c'è un messaggio allegato
    if (!message.reference) {
      message
        .reply(`Il comando deve essere inviato come risposta ad un messaggio già scritto`)
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
        .reply(`Mi dispiace ma qualcosa è andato storto, contatta un amministratore del server`)
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Estraggo la nota
    const args = message.args
    if (!message.args) {
      message.reply(`Devi scrivere anche una nota`).then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    if (message.args.length >= 60) {
      message
        .reply(`La nota deve essere di massimo 60 caratteri`)
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Verifico lo stato dell'utente che ha scritto il comando
    let status = false
    const access = [
      this.client._botSettings.rules.Admin,
      this.client._botSettings.rules.Moderatore,
      this.client._botSettings.rules.Collaboratore,
    ]
    // Se è un admin
    if (message.member.roles.cache.some((itm) => access.includes(itm.name))) {
      status = true
    }
    // Verifico se la nota è già presente
    const presence = await this.modelNote
      .findOne({ message_id: message.reference.messageID })
      .exec()
    if (presence) {
      message
        .reply(`Il messaggio è già stato inserito nelle note.`)
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
    // Provo ad inserirlo in mongo
    try {
      const newModel = this.modelNote({
        guild_id: message.reference.guildID,
        channel_id: message.reference.channelID,
        message_id: message.reference.messageID,
        author_id: message.author.id,
        note: args,
        status: status,
      })
      const resp = await newModel.save()
      // In base se è un componente dello staff
      if (status) {
        message
          .reply(
            `Nota aggiunta con successo per il canale <#${resp.channel_id}>!\nNota: ${resp.note} \n ID: ${resp._id}`,
          )
          .then((m) => m.delete({ timeout: 10000 }))
        message.delete()
        return
      } else {
        message
          .reply(
            `Nota aggiunta con successo<#${resp.channel_id}>, in attesa di approvazione!\nNota: \n${resp.note} \n ID: ${resp._id}`,
          )
          .then((m) => m.delete({ timeout: 10000 }))
        message.delete()
        return
      }
    } catch (e) {
      console.log(e)
      message
        .reply(`Purtroppo non è stato possibile aggiungere la nota..`)
        .then((m) => m.delete({ timeout: 10000 }))
      message.delete()
      return
    }
  }
}
