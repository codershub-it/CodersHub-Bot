async function init(client) {
  // Pulisci il canale
  await ClearChannel(client, client._botSettings.channel.impostazione_ruoli_id)
  // Stampo la parte notifiche
  await roleSelectorGenerator(
    client,
    `Seleziona quali notifiche vuoi ricevere`,
    `Clicca su una delle emoji sottostanti per attivare o disattivare la ricezione delle notifiche.\nUsa il comando ${client.conf.prefix}notification per vedere in quali notifiche hai accesso o clicca sulla tua immagine profilo`,
    client._botSettings.channel.impostazione_ruoli_id,
    client._botSettings.server_id,
    client._botSettings.role_notification_index,
    `se vuoi ricevere le`,
    `Sei uscito dalle notificazioni`,
    `Sei entrato nelle notificazioni`,
  )
  // Stampo la parte categorie
  await roleSelectorGenerator(
    client,
    `Seleziona quali categorie vuoi abilitare`,
    `Clicca su una delle emoji sottostanti per attivare o disattivare l'accesso ad una categoria.\nUsa il comando ${client.conf.prefix}category per vedere in quali categorie hai accesso o clicca sulla tua immagine profilo.`,
    client._botSettings.channel.impostazione_ruoli_id,
    client._botSettings.server_id,
    client._botSettings.role_category_index,
    `se vuoi accedere alla`,
    `Sei uscito dalla categoria`,
    `Sei entrato nella categoria`,
  )
}

async function ClearChannel(client, channel_id) {
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
    _desc += `${role.emoji_item} -> ${desc_line}: ${role}\n`
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
        if (reaction.message.id == message.id) {
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
                        _user.send(`${user} ${message_output} ${role.name}`)
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
                        _user.send(`${user} ${message_input} ${role.name}`)
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
