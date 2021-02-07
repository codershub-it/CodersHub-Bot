const Commands = require('../../core/command')

module.exports = class Event extends Commands {
  constructor(client) {
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
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message) {
    let objParam = {}

    // Vado ad estrarre il Role di un specifico nome
    const roleNotification = this.client._botUtility.getRoleFromName(
      this.client,
      'Notifica',
      'Eventi',
    )

    try {
      objParam = JSON.parse(message.args)
    } catch (e) {
      message.author
        .send(
          'attenzione il json è scritto in modo errato, il bot non riesce a fare il parse del messaggio',
        )
        .catch(() => {
          message.reply(
            'attenzione il json è scritto in modo errato, il bot non riesce a fare il parse del messaggio',
          )
        })
      message.delete()
      return
    }

    if (typeof objParam !== 'object') {
      message.author.send('attenzione il json è scritto in modo errato.').catch(() => {
        message.reply('attenzione il json è scritto in modo errato.')
      })
      message.delete()
      return
    }

    if (!objParam.name && typeof objParam.name !== 'string') {
      message.author.send('manca la key name o non è di tipo stringa').catch(() => {
        message.reply('manca la key name o non è di tipo stringa')
      })
      message.delete()
      return
    }

    if (!objParam.description && typeof objParam.description !== 'string') {
      message.author.send('manca la key description o non è di tipo stringa').catch(() => {
        message.reply('manca la key description o non è di tipo stringa')
      })
      message.delete()
      return
    }

    if (objParam.name.length > 300) {
      message.author.send('il nome è troppo lungo. Massimo 300 caratteri').catch(() => {
        message.reply('il nome è troppo lungo. Massimo 300 caratteri')
      })
      message.delete()
      return
    }

    if (objParam.description.length > 1000) {
      message.author.send('la descrizione è troppo lunga. Massimo 1000 caratteri').catch(() => {
        message.reply('la descrizione è troppo lunga. Massimo 1000 caratteri')
      })
      message.delete()
      return
    }

    if (objParam.link) {
      if (typeof objParam.link !== 'string') {
        message.author.send('la key link non è di tipo stringa').catch(() => {
          message.reply('la key link non è di tipo stringa')
        })
        message.delete()
        return
      }
    }

    if (objParam.img) {
      if (typeof objParam.img !== 'string') {
        message.author.send('la key non è di tipo stringa').catch(() => {
          message.reply('la key non è di tipo stringa')
        })
        message.delete()
        return
      }
    }

    if (!objParam.date_event && typeof objParam.date_event !== 'string') {
      message.author.send('manca la key date_event o non è di tipo stringa').catch(() => {
        message.reply('manca la key date_event o non è di tipo stringa')
      })
      message.delete()
      return
    }

    if (!objParam.days && typeof objParam.days !== 'number') {
      message.author.send('manca la key days o non è di tipo number').catch(() => {
        message.reply('manca la key days o non è di tipo number')
      })
      message.delete()
      return
    }

    if (objParam.days > 10) {
      message.author.send('la key days è maggiore di 10 giorni. Massimo 10 giorni').catch(() => {
        message.reply('la key days è maggiore di 10 giorni. Massimo 10 giorni')
      })
      message.delete()
      return
    }

    // Elimino il messaggio di creazione
    message.delete()

    // Creo EMBED
    const embed = this.getEmbedEvent(objParam)
    // Aggiungo un obj con la lista degli utenti iscritti
    embed.list_users = []
    // Creo il messaggio e aggiungo le emoji
    const embed_message = await message.channel.send(
      `${roleNotification} nuovo evento clicca sulla emoji per partecipare`,
      embed,
    )
    await embed_message.react('⏫')
    await embed_message.react('⏬')

    // Creo il sistema di filtraggio in base alla reaction e invio un messaggio privato
    const filter = (reaction, user) => {
      if (reaction.emoji.name === '⏫') {
        if (!embed.list_users.includes(user.id)) {
          // Invio un messaggio privato
          this.client.users
            .fetch(user.id)
            .then((_user) => {
              _user.send(
                `${user} Hai aderito all'evento: ${objParam.name}! Ti sarà inviata una notifica su Discord!`,
              )
            })
            .catch((e) => {
              console.log(e)
            })
        }
        return true
      } else if (reaction.emoji.name === '⏬') {
        if (embed.list_users.includes(user.id)) {
          // Invio un messaggio privato
          this.client.users
            .fetch(user.id)
            .then((_user) => {
              _user.send(`${user} Hai lasciato l'evento: ${objParam.name}!`)
            })
            .catch((e) => {
              console.log(e)
            })
        }
        return true
      } else {
        return false
      }
    }

    // 86400000 == un giorno in ms
    const time_stop = objParam.days * 86400000

    // Avvio la collector del messaggio
    const collector = embed_message.createReactionCollector(filter, { time: time_stop })
    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === '⏫') {
        // Questo blocco va a aggiungere un utente nella lista list_users
        // Verifico che non sia già presente
        if (!embed.list_users.includes(user.id)) {
          embed.list_users.push(user.id)
          let element = ''
          embed.list_users.map((e) => {
            element += ` <@${e}> `
          })
          embed.fields[0].value = element
          await embed_message.edit(
            `${roleNotification} nuovo evento clicca sulla emoji per partecipare`,
            embed,
          )
        }
        await reaction.users.remove(user.id)
      } else if (reaction.emoji.name === '⏬') {
        // Questo blocco va a togliere un utente dalla lista list_users
        const new_list_users = embed.list_users.filter((e) => e !== user.id)
        embed.list_users = new_list_users
        let element = ''
        embed.list_users.map((e) => {
          element += ` <@${e}> `
        })
        if (new_list_users.length == 0) {
          embed.fields[0].value = 'Nessun utente presente'
        } else {
          embed.fields[0].value = element
        }
        await embed_message.edit(
          `${roleNotification} nuovo evento clicca sulla emoji per partecipare`,
          embed,
        )
        await reaction.users.remove(user.id)
      }
    })
    // Ciclo di chiusura
    collector.on('end', async () => {
      let element = ''
      embed.list_users.map((e) => {
        element += ` <@${e}> `
      })
      embed.fields[1].value = element
      embed.footer = {}
      await embed_message.edit(`L'evento è iniziato!`, embed)
      // Vado a eliminare tutte le reazioni
      embed_message.reactions.removeAll().catch((e) => {
        console.log(e)
      })
      // Invio le notifiche a tutti gli utenti del ciclo.
      embed.list_users.map((user_id) => {
        this.client.users
          .fetch(user_id)
          .then((_user) => {
            _user.send(
              `Ciao, <@${_user}> l'evento ${objParam.name} è iniziato! ` + objParam.link
                ? objParam.link
                : '',
            )
          })
          .catch((e) => {
            console.log(e)
          })
      })
    })
  }

  /**
   * Creo il messaggio embed
   * @param objParam
   * @returns {module:"discord.js".MessageEmbed}
   */
  getEmbedEvent(objParam) {
    const emb = new this.client._botMessageEmbed()
    emb.setTitle(objParam.name)
    emb.setDescription(objParam.description)
    emb.setColor('RANDOM')
    emb.addField(`Utenti che parteciperanno all'evento`, `Nessun utente presente`)
    emb.addField('Data Evento:', `${objParam.date_event}`)
    if (objParam.link) {
      emb.addField(`Link evento`, `[${objParam.name}](${objParam.link})`)
    }
    if (objParam.img) {
      emb.setThumbnail(objParam.img)
    }
    emb.setFooter("Usa le emoji ⏫ per entrare e ⏬ per uscire dall'evento")
    return emb
  }
}
