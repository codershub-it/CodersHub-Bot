const Commands = require('../../core/command')

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
   * @param message
   * @param bot
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
              const obj = {
                cmd: this.cmd,
                event: [this.event.typeEvent.message],
                channel_id: message.channel.id,
                author_id: message.author.id,
                date_end: 100000,
                options: { step: 1 },
              }
              this.event.saveEvent(obj).then(() => {
                message.reply(
                  "Ciao è stato avviato il sistema di creazione dell'evento! Scrivi il nome dell' evento:",
                )
                return
              })
            }
          })
        } else {
          const obj = {
            cmd: this.cmd,
            event: [this.event.typeEvent.message],
            channel_id: message.channel.id,
            author_id: message.author.id,
            date_end: 100000,
            options: { step: 1 },
          }
          this.event.saveEvent(obj).then(() => {
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
   * Viene avviato per gestire un evento messageReactionAdd
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
          doc.options.list_users.push(user.id)
          let element = ''
          doc.options.list_users.map((e) => {
            element += ` <@${e}> `
          })
          message.embeds[0].fields[0].value = element
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
      const obj = {
        cmd: this.cmd,
        event: [this.event.typeEvent.message],
        channel_id: message.channel.id,
        author_id: message.author.id,
        date_end: 100000,
        options: { step: 2, obj: { title: message.content } },
      }
      await this.event.saveEvent(obj)
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
      const obj = {
        cmd: this.cmd,
        event: [this.event.typeEvent.message],
        channel_id: message.channel.id,
        author_id: message.author.id,
        date_end: 100000,
        options: { step: 3, obj: doc.options.obj },
      }
      await this.event.saveEvent(obj)
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
        const obj = {
          cmd: this.cmd,
          event: [this.event.typeEvent.message],
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          options: { step: 4, obj: doc.options.obj },
        }
        await this.event.saveEvent(obj)
      }
    }

    if (doc.options.step === 4) {
      if (this.checkNoMessage(message)) {
        message.reply(
          "Ok, non hai aggiunto nessuna immagine. C'è anche un link? Scrivi il link o altrimenti scrivi no",
        )
        await this.event.deleteEvent(doc._id)
        const obj = {
          cmd: this.cmd,
          event: [this.event.typeEvent.message],
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          options: { step: 5, obj: doc.options.obj },
        }
        await this.event.saveEvent(obj)
      } else {
        message.reply(
          'Hai scritto: ' +
            message.content +
            "!\n Ok Ottimo! Hai anche un link all'evento? Scrivi il link o altrimenti scrivi no",
        )
        doc.options.obj.image = message.content
        await this.event.deleteEvent(doc._id)
        const obj = {
          cmd: this.cmd,
          event: [this.event.typeEvent.message],
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          options: { step: 5, obj: doc.options.obj },
        }
        await this.event.saveEvent(obj)
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
   * @param message
   * @returns {boolean}
   */
  checkNoMessage(message) {
    return message.content === 'no' || message.content === 'No'
  }

  /**
   * Stampo l'evento
   * @param message
   * @param doc
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
    await this.event.saveEvent({
      cmd: this.cmd,
      event: [this.event.typeEvent.messageReactionAdd, this.event.typeEvent.messageReactionRemove],
      channel_id: embed_message.channel.id,
      message_id: embed_message.id,
      date_end: Date.parse(doc.options.obj.date) - Date.now(),
      emoji: '✅',
      options: { list_users: [] },
    })
  }

  /**
   * Creo il messaggio embed
   * @param objParam
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
    if (objParam.image) {
      emb.setThumbnail(objParam.image)
    }
    emb.setFooter("Usa le emoji ⏫ per entrare e ⏬ per uscire dall'evento")
    return emb
  }
}
