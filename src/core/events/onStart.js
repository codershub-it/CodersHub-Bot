async function init(client) {
  // Pulisci il canale
  await clearChannel(client, client._botSettings.channel.impostazione_ruoli_id)
  // Stampo la parte notifiche
  await roleSelectorGenerator(
    client,
    `Seleziona quali notifiche vuoi ricevere cliccando sulle emoji sotto questo messaggio. Le opzioni disponibili sono:`,
    `Clicca su una delle emoji sottostanti per attivare o disattivare la ricezione delle notifiche.\nUsa il comando ${client.conf.prefix}notification per vedere in quali notifiche hai accesso o clicca sulla tua immagine profilo`,
    client._botSettings.channel.impostazione_ruoli_id,
    client._botSettings.server_id,
    client._botSettings.role_notification_index,
    `Per ricevere le`,
    `Sei uscito dalle notificazioni`,
    `Sei entrato nelle notificazioni`,
  )
  // Stampo la parte categorie
  await roleSelectorGenerator(
    client,
    `Seleziona quali categorie vuoi accedere cliccando sulle emoji sotto questo messaggio. Le opzioni disponibili sono:`,
    `Clicca su una delle emoji sottostanti per attivare o disattivare l'accesso ad una categoria.\nUsa il comando ${client.conf.prefix}category per vedere in quali categorie hai accesso o clicca sulla tua immagine profilo.`,
    client._botSettings.channel.impostazione_ruoli_id,
    client._botSettings.server_id,
    client._botSettings.role_category_index,
    `Per accedere`,
    `Sei uscito dalla categoria`,
    `Sei entrato nella categoria`,
  )
  await printStructureServer(client, client._botSettings.channel.impostazione_ruoli_id)
}

async function printStructureServer(client, channel_id) {
  const _server = []
  const channels = client.channels.cache.array()
  const channel = client.channels.cache.get(channel_id)
  const roles_white = client._botUtility.getRoleFromNameRaw(client, 'Sezione')
  // Creo la lista
  for (const _channel of channels) {
    if (_channel.type == 'category') {
      // Estrapolo i permessi di categoria
      const roles = _channel.permissionOverwrites.map((e) => {
        return e.id
      })
      let presence_cat = 0
      for (const role of roles) {
        for (const role_w of roles_white) {
          if (role == role_w.id) {
            ++presence_cat
          }
        }
      }
      if (presence_cat > 0) {
        const _sub_server = []
        // Estrae tutti i canali di quel canale.
        for (const element_sub of channels) {
          if (element_sub.parentID == _channel.id) {
            // Estrapolo i permessi di canale
            const sub_roles = element_sub.permissionOverwrites.map((e) => {
              return e.id
            })
            let presence_can = 0
            for (const role of sub_roles) {
              for (const role_w of roles_white) {
                if (role == role_w.id) {
                  ++presence_can
                }
              }
            }
            if (presence_can > 0) {
              _sub_server.splice(element_sub.rawPosition, 0, {
                type: element_sub.type,
                name: element_sub.name,
                topic: element_sub.topic,
                id: element_sub.id,
              })
            }
          }
        }
        _server.splice(channel.rawPosition, 0, {
          type: _channel.type,
          name: _channel.name,
          id: _channel.id,
          sub_channels: _sub_server,
        })
      }
    }
  }

  let description = ''
  for (const e of _server) {
    let sub_channel = ''
    for (const se of e.sub_channels) {
      const __id = se.type === 'voice' ? '' : '[<#' + se.id + '>]'
      sub_channel += '' + __id + ` [**${se.name}**]\n`
    }
    description += `**${e.name}** canali sono:\n`
    description += sub_channel
  }

  const emb = new client._botMessageEmbed()
  emb.setTitle(
    `Le sezioni accessibili con emoji del server CodersHub sono strutturate nel seguente modo`,
  )
  emb.setDescription(description)
  emb.setColor('RANDOM')
  await channel.send(emb).catch((e) => {
    console.log(e)
  })
}

async function clearChannel(client, channel_id) {
  // Svuoto il canale impostazione_ruoli_id
  const channel = client.channels.cache.get(channel_id)
  if (channel) {
    const fetched = await channel.messages.fetch({ limit: 99 })
    await channel.bulkDelete(fetched).catch((e) => {
      console.log(e)
    })
  }
}

/**
 * Questo metodo serve a creare una lista con selettore, genererà il testo nuovo.
 * @param client {Client} Client di discord
 * @param title {String} Titolo da visualizzare
 * @param footer {String} Footer da visualizzare
 * @param channel_id {String} Il canale dove stampare
 * @param server_id {String} Il server dove stampare
 * @param index {String} Il testo indice del ruolo es: Notifica Tino (Notifica e l'index)
 * @param desc_line {String} La linea che descrive il ruolo solo testo si compone in emoji desc_line e nome delle role
 * @param message_output {String} Messaggio privato uscita
 * @param message_input {String} Messaggio privato ingresso
 * @param emoji {String[]}
 * @returns {Promise<void>}
 */
async function roleSelectorGenerator(
  client,
  title,
  footer,
  channel_id,
  server_id,
  index,
  desc_line,
  message_output,
  message_input,
  emoji = [
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
    '⏪',
    '⏮',
    '🔼',
    '⏫',
    '🔽',
    '⏬',
    '⏸',
    '⏹',
    '⏺',
  ],
) {
  const emoji_list = []
  const roles_items = []

  // Estraggo il canale
  const channel = client.channels.cache.get(channel_id)

  // Estrapolo la lista dei ruole che iniziano con Notifica
  const guild = client.guilds.cache.get(server_id)
  if (guild) {
    const roles = guild.roles.cache.array()
    let i = 0
    roles.forEach((role) => {
      emoji_list.push(emoji[i])
      if (role.name.search(index) >= 0) {
        const _role = role
        _role.emoji_item = emoji[i]
        roles_items.push(_role)
        i++
      }
    })
  }

  // Invio il messaggio per la gestione dei permessi
  const emb = new client._botMessageEmbed()
  emb.setTitle(title)
  emb.setColor(`RANDOM`)
  emb.setFooter(footer)
  let _desc = ''
  roles_items.forEach((role) => {
    _desc += `${role.emoji_item} ${desc_line}: ${role}\n`
  })
  emb.setDescription(_desc)
  // Invia il messaggio
  await channel
    .send(emb)
    .then(async (message) => {
      // Aggiungo le reazioni
      for (const role of roles_items) {
        await message.react(`${role.emoji_item}`).catch((e) => {
          console.log(e)
        })
      }
      // Creo il sistema di filtraggio in base alla emoji
      const filter = (reaction) => emoji_list.includes(reaction.emoji.name)
      // Collector
      const collector = message.createReactionCollector(filter)
      collector.on('collect', async (reaction, user) => {
        if (reaction.message.id === message.id) {
          for (const role of roles_items) {
            if (reaction.emoji.name === role.emoji_item) {
              const member = guild.members.cache.get(user.id)
              // Verifico se ha già quel ruolo
              if (member._roles.includes(role.id)) {
                // Tolgo il ruolo
                member.roles
                  .remove(role)
                  .then(() => {
                    client.users
                      .fetch(user.id)
                      .then((_user) => {
                        _user.send(`${user} ${message_output} ${role.name}`).then((e) => {
                          e.delete({ timeout: 5000 })
                        })
                      })
                      .catch((e) => {
                        console.log(e)
                      })
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              } else {
                // Aggiungo il ruolo
                member.roles
                  .add(role)
                  .then(() => {
                    client.users
                      .fetch(user.id)
                      .then((_user) => {
                        _user.send(`${user} ${message_input} ${role.name}`).then((e) => {
                          e.delete({ timeout: 5000 })
                        })
                      })
                      .catch((e) => {
                        console.log(e)
                      })
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              }
              await reaction.users.remove(user.id)
            }
          }
        }
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

module.exports = { init }
