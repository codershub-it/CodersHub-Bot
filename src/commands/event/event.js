const Commands = require('../../core/command')
/**
 * Questo comando crea un nuovo evento.
 * Gli utenti posso registrarsi è quando scadrà l'evento
 * saranno avvisati con un messaggio privato.
 * @type {RegisterEvent}
 */
module.exports = class Event extends Commands {
  constructor(client, event) {
    super(client)
    this.cmd = 'Event'
    this.alias = 'event'
    this.args = ''
    this.example = ''
    this.description = 'Questo comando crea un evento'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Moderatore,
      client._botSettings.rules.Collaboratore,
    ]
    this.displayHelp = 1
    this.client = client
    this.event = event
  }

  /**
   * Qui si esegue il processo del comando
   * @param message {module:"discord.js".Message}
   */
  async execution(message) {
    await this.event
      .getEventMessage(message.channel.id, message.author.id, this.event.typeEvent.message)
      .then((docs) => {
        if (docs.length > 0) {
          // Controllo se è scaduto
          docs.forEach((doc) => {
            if (new Date() < new Date(doc.date_end)) {
              message.reply('Mi dispiace hai già un evento in costruzione')
              return
            } else {
              this.event
                .saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
                  step: 1,
                })
                .then(() => {
                  message.reply(
                    "Ciao è stato avviato il sistema di creazione dell'evento! Scrivi il nome dell' evento:",
                  )
                  return
                })
            }
          })
        } else {
          this.event
            .saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
              step: 1,
            })
            .then(() => {
              message.reply(
                "Ciao è stato avviato il sistema di creazione dell'evento! Scrivi il nome dell' evento:",
              )
              return
            })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  /**
   * Questo metodo viene avviato solo alla scadenza di un determinato evento tipo messaggio
   * @param doc {Document}
   */
  eventMessageClose(doc) {
    this.client.channels.fetch(doc.channel_id).then((channel) => {
      // Stampo il messaggio di avviso all'utente
      channel.send(
        `<@${doc.author_id}> comando **&event** è scaduto, rilancia il comando per aggiungere un evento.`,
      )
      // Elimino l'evento
      this.event.deleteEvent(doc._id)
    })
  }

  /**
   * Questo metodo viene avviato solo alla scadenza di un determinato evento tipo reazione
   * @param doc {Document}
   */
  eventReactionClose(doc) {
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )
    this.client.channels.fetch(doc.channel_id).then((channel) => {
      channel.messages.fetch(doc.message_id).then(async (message) => {
        // Tolgo tutte le reactions
        await message.reactions.removeAll()
        // Modifico il titolo del evento
        await message.edit(`${roleNotification} L'evento è cominciato!`, message.embeds)
        // Invio tutti i messaggi privati
        const mentions_user = doc.options.list_users
        if (mentions_user.length > 0) {
          mentions_user.forEach((user_id) => {
            this.client.users.fetch(user_id).then((user) => {
              // Invio il messaggio privato all'utente
              user.send(
                `${user} L'evento: ${message.embeds[0].title} è cominciato! [link](${message.embeds[0].url})` +
                  message.embeds[0].url
                  ? `[link](${message.embeds[0].url})`
                  : '',
              )
            })
          })
        }
        // Elimino tutti gli eventi di quel messaggio di tipo reaction perché ho eliminato tutte le reactions
        await this.event.deleteManyEvents({
          channel_id: doc.channel_id,
          message_id: doc.message_id,
        })
      })
    })
  }

  /**
   * Viene avviato per gestire un evento messageReactionAdd
   * @param messageReaction {module:"discord.js".MessageReaction}
   * @param user {module:"discord.js".User}
   * @param doc {Document}
   */
  eventReactionAdd(messageReaction, user, doc) {
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )
    this.client.channels.fetch(messageReaction.message.channel.id).then((channel) => {
      channel.messages.fetch(messageReaction.message.id).then((message) => {
        if (!doc.options.list_users.includes(user.id)) {
          user.send(
            `${user} Hai aderito all'evento: ${message.embeds[0].title}! Ti sarà inviata una notifica su Discord!`,
          )
          // Aggiungo l'utente alla lista degli utenti iscritti
          doc.options.list_users.push(user.id)
          let element = ''
          doc.options.list_users.map((e) => {
            element += ` <@${e}> `
          })
          message.embeds[0].fields[0].value = element
          // Aggiorno l'evento
          this.event.updateEvent(doc._id, doc).then(async () => {
            await message.edit(
              `${roleNotification} nuovo evento clicca sulla ✅ emoji per partecipare (Modificato)`,
              message.embeds,
            )
          })
        }
      })
    })
  }
  /**
   * Viene avviato per gestire un evento messageReactionRemove
   * @param messageReaction {module:"discord.js".MessageReaction}
   * @param user {module:"discord.js".User}
   * @param doc {Document}
   */
  eventReactionRemove(messageReaction, user, doc) {
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )
    this.client.channels.fetch(messageReaction.message.channel.id).then((channel) => {
      channel.messages.fetch(messageReaction.message.id).then(async (message) => {
        user.send(`${user} Hai lasciato l'evento: ${message.embeds[0].title}!`)
        // Elimino l'utente che ha tolto l'emoji
        const new_list_users = doc.options.list_users.filter((e) => e !== user.id)
        doc.options.list_users = new_list_users
        let element = ''
        doc.options.list_users.map((e) => {
          element += ` <@${e}> `
        })
        if (new_list_users.length == 0) {
          message.embeds[0].fields[0].value = 'Nessun utente presente'
        } else {
          message.embeds[0].fields[0].value = element
        }
        // Aggiorno l'evento
        this.event.updateEvent(doc._id, doc).then(async () => {
          await message.edit(
            `${roleNotification} nuovo evento clicca sulla ✅ emoji per partecipare (Modificato)`,
            message.embeds,
          )
        })
      })
    })
  }

  /**
   * Questo metodo va a processare le chiamate in coda
   * @param message
   * @param event
   * @param doc
   * @returns {Promise<void>}
   */
  async eventMessage(message, doc) {
    if (doc.options.step === 1) {
      if (message.content.length == 0) {
        message.reply('Il titolo deve avere dei caratteri, riprova!')
        return
      }
      message.reply('Hai scritto: ' + message.content + '!\nOk Ottimo ora scrivi la descrizione')
      await this.event.deleteEvent(doc._id)
      await this.event.saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
        step: 2,
        obj: { title: message.content },
      })
    }

    if (doc.options.step === 2) {
      if (message.content.length == 0) {
        message.reply('La descrizione non può essere vuota deve avere dei caratteri, riprova!')
        return
      }
      message.reply(
        'Hai scritto: ' +
          message.content +
          '!\nOk Ottimo ora scrivi la options dell\'evento come d\'esempio "2013-11-18 11:55"',
      )
      doc.options.obj.description = message.content
      await this.event.deleteEvent(doc._id)
      await this.event.saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
        step: 3,
        obj: doc.options.obj,
      })
    }

    if (doc.options.step === 3) {
      if (Date.parse(message.content) - Date.now() <= 0) {
        message.reply(
          'Hai scritto: ' +
            message.content +
            '!\n La options o il periodo non è corretto, riprova!',
        )
        return
      } else {
        message.reply(
          'Hai scritto: ' +
            message.content +
            '!\n Ok Ottimo! Hai anche una immagine? Scrivi il link o altrimenti scrivi no',
        )
        doc.options.obj.date = message.content
        await this.event.deleteEvent(doc._id)
        await this.event.saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
          step: 4,
          obj: doc.options.obj,
        })
      }
    }

    if (doc.options.step === 4) {
      if (this.checkNoMessage(message)) {
        message.reply(
          "Ok, non hai aggiunto nessuna immagine. C'è anche un link? Scrivi il link o altrimenti scrivi no",
        )
        await this.event.deleteEvent(doc._id)
        await this.event.saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
          step: 5,
          obj: doc.options.obj,
        })
      } else {
        message.reply(
          'Hai scritto: ' +
            message.content +
            "!\n Ok Ottimo! Hai anche un link all'evento? Scrivi il link o altrimenti scrivi no",
        )
        doc.options.obj.image = message.content
        await this.event.deleteEvent(doc._id)
        await this.event.saveEventMessage(this.cmd, message.channel.id, message.author.id, 100000, {
          step: 5,
          obj: doc.options.obj,
        })
      }
    }

    if (doc.options.step === 5) {
      if (this.checkNoMessage(message)) {
        message.reply("Ok, non hai aggiunto nessun link. Ottimo ora creo l'evento!")
        await this.event.deleteEvent(doc._id)
        await this.runMessageEvent(message, doc)
      } else {
        message.reply(
          'Hai scritto: ' + message.content + "!\n Ok Ottimo! Ottimo ora creo l'evento!",
        )
        doc.options.obj.link = message.content
        await this.event.deleteEvent(doc._id)
        await this.runMessageEvent(message, doc)
      }
    }
  }

  /**
   * Verifico se c'è il no o No
   * @param message {module:"discord.js".Message}
   * @returns {boolean}
   */
  checkNoMessage(message) {
    return message.content === 'no' || message.content === 'No'
  }

  /**
   * Stampo l'evento
   * @param message {module:"discord.js".Message}
   * @param doc {Document}
   * @returns {Promise<void>}
   */
  async runMessageEvent(message, doc) {
    const embed = this.getEmbedEvent(doc.options.obj)
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )
    const eventChannel = this.client.channels.cache.find(
      (channel) => channel.id === this.client._botSettings.channel.event_id,
    )
    const embed_message = await eventChannel
      .send(`${roleNotification} nuovo evento clicca sulla emoji ✅ per partecipare`, embed)
      .catch((e) => {
        console.log(e)
      })
    await embed_message.react('✅')
    // Aggiungo l'evento reactions
    await this.event.saveEventReaction(
      this.cmd,
      [this.event.typeEvent.messageReactionAdd, this.event.typeEvent.messageReactionRemove],
      embed_message.channel.id,
      embed_message.id,
      Date.parse(doc.options.obj.date) - Date.now(),
      '✅',
      { list_users: [] },
    )
  }

  /**
   * Creo il messaggio embed
   * @param objParam {Object}
   * @returns {module:"discord.js".MessageEmbed}
   */
  getEmbedEvent(objParam) {
    const emb = new this.client._botMessageEmbed()
    emb.setTitle(objParam.title)
    emb.setDescription(objParam.description)
    emb.setColor('RANDOM')
    emb.addField(`Utenti che parteciperanno all'evento`, `Nessun utente presente`)
    emb.addField('options Evento:', `${objParam.date}`)
    if (objParam.link) {
      emb.addField(`Link evento`, `[${objParam.title}](${objParam.link})`)
    }
    emb.setThumbnail(
      objParam.image
        ? objParam.image
        : 'https://media1.tenor.com/images/d7ef1ed319752179f2ee97f9bd4b2ef4/tenor.gif',
    )
    emb.setFooter(
      `Clicca sulla emoji ✅ per partecipare all'evento è ricevere una notifica privata quando l'evento partirà!`,
      objParam.image
        ? objParam.image
        : 'https://media1.tenor.com/images/ac032149017172ffc25571fae9fb6a63/tenor.gif',
    )
    return emb
  }
}
