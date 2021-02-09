const Commands = require('../../core/command')

module.exports = class Note extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'Note'
    this.alias = 'note'
    this.args = 'inserisci la nota (Massimo 60 caratteri)'
    this.example = `${client.conf.prefix}addNote Qui si parla di Angular e delle sue problematiche`
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
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Errore inserimento nota')
      embed.setDescription(
        'Il comando deve essere inviato come risposta ad un messaggio già scritto',
      )
      message.reply(embed)
      message.delete()
      return
    }
    // Estraggo i dati del messaggio allegato
    if (
      !message.reference.channelID ||
      !message.reference.guildID ||
      !message.reference.messageID
    ) {
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Nota')
      embed.setDescription(
        'Mi dispiace ma qualcosa è andato storto, contatta un amministratore del server',
      )
      message.reply(embed)
      message.delete()
      return
    }
    // Estraggo la nota
    const args = message.args
    if (!message.args) {
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Nota')
      embed.setDescription('Devi scrivere anche una nota')
      message.reply(embed)
      message.delete()
      return
    }
    if (message.args.length >= 60) {
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Nota')
      embed.setDescription('La nota deve essere di massimo 60 caratteri')
      message.reply(embed)
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
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Errore inserimento Nota')
      embed.setDescription(`Il messaggio è già stato inserito nelle note.`)
      embed.setFooter(`ID: ${presence._id}`)
      message.reply(embed)
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
        const embed = new this.client._botMessageEmbed()
        embed.setTitle('Hai aggiunto una nota')
        embed.setDescription(
          `Nota aggiunta con successo per il canale <#${resp.channel_id}>!\nNota: ${resp.note}`,
        )
        embed.setFooter(`ID: ${resp._id}`)
        message.reply(embed)
        message.delete()
      } else {
        const embed = new this.client._botMessageEmbed()
        embed.setTitle('Hai aggiunto una nota')
        embed.setDescription(
          `Nota aggiunta con successo<#${resp.channel_id}>, in attesa di approvazione!\nNota: \n${resp.note}`,
        )
        embed.setFooter(`ID: ${resp._id}`)
        message.reply(embed)
        message.delete()
      }
    } catch (e) {
      console.log(e)
      const embed = new this.client._botMessageEmbed()
      embed.setTitle('Errore inserimento Nota')
      embed.setDescription('Purtroppo non è stato possibile aggiungere la nota..')
      message.reply(embed)
      message.delete()
    }
  }
}
