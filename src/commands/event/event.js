const Commands = require('../../core/command')

module.exports = class Event extends Commands {
  constructor(client, queue) {
    super(client)
    this.cmd = 'Event'
    this.alias = 'event'
    this.args =
      '{ "name": String, "description": String, "link": String (Optional), "img": String (Optional), "date_event": String, "days_for_close": Int}'
    this.example = `${client.conf.prefix}Event { "name": "Test", "description": "Description test", "link": "www.test.com", "img": "test.com/img.png", "date_event": "11.03.2022 11:33", "days_for_close": 5 }`
    this.description = 'Questo comando crea un evento'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Moderatore,
      client._botSettings.rules.Collaboratore,
    ]
    this.displayHelp = 1
    this.client = client
    this.queue = queue
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   */
  async execution(message) {
    await this.queue
      .getQueue(this.cmd, message.channel.id, message.author.id, this.queue.event.message)
      .then((docs) => {
        if (docs.length > 0) {
          // Controllo se è presente già un evento
          let presence_event = 0
          docs.forEach((doc) => {
            if (new Date() < new Date(doc.date.date_end)) {
              presence_event++
            }
          })
          if (presence_event > 0) {
            message.reply('Mi dispiace hai già un evento in costruzione')
            return
          } else {
            const obj = {
              channel_id: message.channel.id,
              author_id: message.author.id,
              date_end: 100000,
              data: { step: 1 },
            }
            this.queue.saveQueue(this.cmd, this.queue.event.message, obj).then(() => {
              message.reply("Ciao! Scrivi il nome dell' evento:")
              return
            })
          }
        } else {
          const obj = {
            channel_id: message.channel.id,
            author_id: message.author.id,
            date_end: 100000,
            data: { step: 1 },
          }
          this.queue.saveQueue(this.cmd, this.queue.event.message, obj).then(() => {
            message.reply("Ciao! Scrivi il nome dell' evento:")
            return
          })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // async queuesReaction(message, doc) {}

  /**
   * Questo metodo va a processare le chiamate in coda
   * @param message
   * @param event
   * @param doc
   * @returns {Promise<void>}
   */
  async queuesMessage(message, doc) {
    /**
     * Step
     * 1. Note
     * 2. Descrizione
     * 3. Data
     * 4. Link immagine
     * 5. Link url
     * 6. Avvio stampa
     */

    if (doc.data.step === 1) {
      message.reply('Hai scritto: ' + message.content + '!\nOk Ottimo ora scrivi la descrizione')
      await this.queue.deleteQueue(doc._id)
      const data = {
        channel_id: message.channel.id,
        author_id: message.author.id,
        date_end: 100000,
        data: { step: 2, obj: { title: message.content } },
      }
      await this.queue.saveQueue(this.cmd, this.queue.event.message, data)
    }

    if (doc.data.step === 2) {
      message.reply(
        'Hai scritto: ' +
          message.content +
          '!\nOk Ottimo ora scrivi la data dell\'evento come d\'esempio "2013-11-18 11:55"',
      )
      doc.data.obj.description = message.content
      await this.queue.deleteQueue(doc._id)
      const data = {
        channel_id: message.channel.id,
        author_id: message.author.id,
        date_end: 100000,
        data: { step: 3, obj: doc.data.obj },
      }
      await this.queue.saveQueue(this.cmd, this.queue.event.message, data)
    }

    if (doc.data.step === 3) {
      if (Date.parse(message.content) - Date.now() <= 0) {
        message.reply(
          'Hai scritto: ' + message.content + '!\n La data o il periodo non è corretto, riprova!',
        )
        return
      } else {
        message.reply(
          'Hai scritto: ' +
            message.content +
            '!\n Ok Ottimo! Hai anche una immagine? Scrivi il link o altrimenti scrivi no',
        )
        doc.data.obj.date = message.content
        await this.queue.deleteQueue(doc._id)
        const data = {
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          data: { step: 4, obj: doc.data.obj },
        }
        await this.queue.saveQueue(this.cmd, this.queue.event.message, data)
      }
    }

    if (doc.data.step === 4) {
      if (this.checkNoMessage(message)) {
        message.reply(
          "Ok, non hai aggiunto nessuna immagine. C'è anche un link? Scrivi il link o altrimenti scrivi no",
        )
        await this.queue.deleteQueue(doc._id)
        const data = {
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          data: { step: 5, obj: doc.data.obj },
        }
        await this.queue.saveQueue(this.cmd, this.queue.event.message, data)
      } else {
        message.reply(
          'Hai scritto: ' +
            message.content +
            "!\n Ok Ottimo! Hai anche un link all'evento? Scrivi il link o altrimenti scrivi no",
        )
        doc.data.obj.image = message.content
        await this.queue.deleteQueue(doc._id)
        const data = {
          channel_id: message.channel.id,
          author_id: message.author.id,
          date_end: 100000,
          data: { step: 5, obj: doc.data.obj },
        }
        await this.queue.saveQueue(this.cmd, this.queue.event.message, data)
      }
    }

    if (doc.data.step === 5) {
      if (this.checkNoMessage(message)) {
        message.reply("Ok, non hai aggiunto nessun link. Ottimo ora creo l'evento!")
        await this.queue.deleteQueue(doc._id)
        await this.runMessaggeEvent(message, doc)
      } else {
        message.reply(
          'Hai scritto: ' + message.content + "!\n Ok Ottimo! Ottimo ora creo l'evento!",
        )
        doc.data.obj.link = message.content
        await this.queue.deleteQueue(doc._id)
        await this.runMessaggeEvent(message, doc)
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
  async runMessaggeEvent(message, doc) {
    await this.queue.deleteQueue(doc._id)
    const embed = this.getEmbedEvent(doc.data.obj)
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )
    const eventChannel = this.client.channels.cache.find(
      (channel) => channel.id === this.client._botSettings.channel.event_id,
    )
    const embed_message = await eventChannel
      .send(`${roleNotification} nuovo evento clicca sulla emoji per partecipare`, embed)
      .catch((e) => {
        console.log(e)
      })
    await embed_message.react('⏫')
    await embed_message.react('⏬')

    await this.queue.saveQueue(this.cmd, this.queue.event.messageReactionAdd, {
      channel_id: embed_message.channel.id,
      message_id: embed_message.id,
      date_end: Date.parse(doc.data.obj.date) - Date.now(),
      data: { embed_message: embed_message, list_users: [], emoji: '⏫' },
    })
    await this.queue.saveQueue(this.cmd, this.queue.event.messageReactionRemove, {
      channel_id: embed_message.channel.id,
      message_id: embed_message.id,
      date_end: Date.parse(doc.data.obj.date) - Date.now(),
      data: { embed_message: embed_message, list_users: [], emoji: '⏬' },
    })

    // // Creo il sistema di filtraggio in base alla reaction e invio un messaggio privato
    // const filter = (reaction, user) => {
    //   if (reaction.emoji.name === '⏫') {
    //     if (!embed.list_users.includes(user.id)) {
    //       // Invio un messaggio privato
    //       this.client.users
    //         .fetch(user.id)
    //         .then((_user) => {
    //           _user.send(
    //             `${user} Hai aderito all'evento: ${doc.data.obj.title}! Ti sarà inviata una notifica su Discord!`,
    //           )
    //         })
    //         .catch((e) => {
    //           console.log(e)
    //         })
    //     }
    //     return true
    //   } else if (reaction.emoji.name === '⏬') {
    //     if (embed.list_users.includes(user.id)) {
    //       // Invio un messaggio privato
    //       this.client.users
    //         .fetch(user.id)
    //         .then((_user) => {
    //           _user.send(`${user} Hai lasciato l'evento: ${doc.data.obj.title}!`)
    //         })
    //         .catch((e) => {
    //           console.log(e)
    //         })
    //     }
    //     return true
    //   } else {
    //     return false
    //   }
    // }
    //
    // // Avvio la collector del messaggio
    // const collector = embed_message.createReactionCollector(filter, {
    //   time: Date.parse(doc.data.obj.date) - Date.now(),
    // })
    // collector.on('collect', async (reaction, user) => {
    //   if (reaction.emoji.name === '⏫') {
    //     // Questo blocco va a aggiungere un utente nella lista list_users
    //     // Verifico che non sia già presente
    //     if (!embed.list_users.includes(user.id)) {
    //       embed.list_users.push(user.id)
    //       let element = ''
    //       embed.list_users.map((e) => {
    //         element += ` <@${e}> `
    //       })
    //       embed.fields[0].value = element
    //       await embed_message.edit(
    //         `${roleNotification} nuovo evento clicca sulla emoji per partecipare`,
    //         embed,
    //       )
    //     }
    //     await reaction.users.remove(user.id)
    //   } else if (reaction.emoji.name === '⏬') {
    //     // Questo blocco va a togliere un utente dalla lista list_users
    //     const new_list_users = embed.list_users.filter((e) => e !== user.id)
    //     embed.list_users = new_list_users
    //     let element = ''
    //     embed.list_users.map((e) => {
    //       element += ` <@${e}> `
    //     })
    //     if (new_list_users.length == 0) {
    //       embed.fields[0].value = 'Nessun utente presente'
    //     } else {
    //       embed.fields[0].value = element
    //     }
    //     await embed_message.edit(
    //       `${roleNotification} nuovo evento clicca sulla emoji per partecipare`,
    //       embed,
    //     )
    //     await reaction.users.remove(user.id)
    //   }
    // })
    // // Ciclo di chiusura
    // collector.on('end', async () => {
    //   let element = ''
    //   embed.list_users.map((e) => {
    //     element += ` <@${e}> `
    //   })
    //   embed.fields[1].value = element
    //   embed.footer = {}
    //   await embed_message.edit(`L'evento è iniziato!`, embed)
    //   // Vado a eliminare tutte le reazioni
    //   embed_message.reactions.removeAll().catch((e) => {
    //     console.log(e)
    //   })
    //   // Invio le notifiche a tutti gli utenti del ciclo.
    //   embed.list_users.map((user_id) => {
    //     this.client.users
    //       .fetch(user_id)
    //       .then((_user) => {
    //         _user.send(
    //           `Ciao, <@${_user}> l'evento ${doc.data.obj.title} è iniziato! ` + doc.data.obj.link
    //             ? doc.data.obj.link
    //             : '',
    //         )
    //       })
    //       .catch((e) => {
    //         console.log(e)
    //       })
    //   })
    // })
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
    emb.addField('Data Evento:', `${objParam.date}`)
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
