/**
 * Questa è la classe madre di commands se si vuole creare dei metodi o variabili per tutti i comandi
 * @type {Commands}
 */
module.exports = class Commands {
  /**
   * Estrapola il valore del testo tra le prime [] e risponde il valore all'interno e il txt senza quel elemento
   * @param txt
   * @returns {{txt: string, squareValue: string}}
   */
  estractFromSquareBrackets(txt, index = 0) {
    let squareValue = ''
    let result = ''
    // Riferimento di lingua tra [linguaggio]
    if (txt.indexOf('[', index) == 0 && txt.indexOf(']', index) > 0) {
      squareValue = txt.substring(txt.indexOf('[', index) + 1, txt.indexOf(']', index))
      const langLast = txt.indexOf(']', index)
      // Elimino la parte lang [linguaggio]
      result = txt.substr(langLast + 1)
    }
    return { txt: result, squareValue: squareValue }
  }

  /**
   * Evidenza un valore nella stringa
   * @param str
   * @param value
   * @returns {*|void|string}
   */
  highlightValueInString(str, value) {
    if (value) {
      return str.replace(value, '**' + value + '**')
    } else {
      return str
    }
  }

  /**
   * Crea una link al messaggio
   * @param guild_id
   * @param channel_id
   * @param message_id
   * @returns {string}
   */
  makeStringUrl(guild_id, channel_id, message_id) {
    return `https://discord.com/channels/${guild_id}/${channel_id}/${message_id}`
  }

  /**
   * Taglia una stringa
   * @param str
   * @param num
   * @returns {string|*}
   */
  truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

  /**
   * Attende un x tempo in ms
   * @param ms
   */
  wait(ms) {
    const start = new Date().getTime()
    let end = start
    while (end < start + ms) {
      end = new Date().getTime()
    }
  }

  async embedCompose(embeds = [], message, client) {
    // Pagina start
    let currentPage = 0
    // Invio comando

    if (embeds.length > 1) {
      const queueEmbed = await message.channel.send(
        `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
        embeds[currentPage],
      )
      // Aggiungo le reazioni
      await queueEmbed.react('⬅️')
      await queueEmbed.react('➡️')
      await queueEmbed.react('ℹ️')
      await queueEmbed.react('❔')
      await queueEmbed.react('🔄')
      await queueEmbed.react('❌')
      // Creo il sistema di filtraggio in base alla reaction
      const filter = (reaction, user) =>
        ['⬅️', '➡️', '❌', 'ℹ️', '❔', '🔄'].includes(reaction.emoji.name) &&
        message.author.id === user.id
      const collector = queueEmbed.createReactionCollector(filter)
      // Avvio il collect di eventi
      collector.on('collect', async (reaction, user) => {
        // In base al tipo di reazione effettuo un processo di cambio pagina.
        if (reaction.emoji.name === '➡️') {
          if (currentPage < embeds.length - 1) {
            currentPage++
            await queueEmbed.edit(
              `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
              embeds[currentPage],
            )
            await reaction.users.remove(user.id)
          }
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === '⬅️') {
          if (currentPage !== 0) {
            --currentPage
            await queueEmbed.edit(
              `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
              embeds[currentPage],
            )
            await reaction.users.remove(user.id)
          }
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === 'ℹ️') {
          // Comando info
          const embed = new client._botMessageEmbed()
          embed.setDescription(
            '⬅️ : Pagina indietro\n' +
              '➡️ : Pagina avanti\n' +
              'ℹ️ : Info comandi\n' +
              '❔ : Info composizione comandi\n' +
              '🔄 : Ricarica questo elemento\n' +
              '❌ : Elimina embed\n',
          )
          await queueEmbed.edit(`Descrizione comandi`, embed)
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === '❔') {
          // Question tab
          const embed = new client._botMessageEmbed()
          embed.setTitle('Come utilizzare il bot')
          embed.setDescription(
            '**Ciao! Benvenuto nella pagina della guida.**\n' +
              '**Come si usa questo bot?**\n' +
              'Leggere la firma del bot è piuttosto semplice.\n\n' +
              '**<argomento>**\n' +
              "Ciò significa che l'argomento è obbligatorio.\n\n" +
              '**[argomento]**\n' +
              "Ciò significa che l'argomento è facoltativo.\n\n" +
              '**"argomento"**\n' +
              "Ciò significa che l'argomento deve essere inserito tra doppie virgolette.\n\n" +
              '[A | B]\n' +
              'Ciò significa che può essere A o B.\n\n' +
              '**[argomento...]**\n' +
              'Ciò significa che puoi avere più argomenti.\n\n' +
              'il comando e il resto degli argomenti deve essere sempre separati da uno spazio\n',
          )
          await queueEmbed.edit(`Descrizione comandi`, embed)
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === '🔄') {
          currentPage = 0
          await queueEmbed.edit(
            `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
            embeds[currentPage],
          )
          await reaction.users.remove(user.id)
        } else {
          collector.stop()
          await queueEmbed.delete()
          await message.delete()
        }
      })
    } else {
      const queueEmbed = await message.channel.send(
        `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
        embeds[currentPage],
      )
      // Aggiungo le reazioni
      await queueEmbed.react('ℹ️')
      await queueEmbed.react('❔')
      await queueEmbed.react('🔄')
      await queueEmbed.react('❌')
      // Creo il sistema di filtraggio in base alla reaction
      const filter = (reaction, user) =>
        ['❌', 'ℹ️', '❔', '🔄'].includes(reaction.emoji.name) && message.author.id === user.id
      const collector = queueEmbed.createReactionCollector(filter)
      // Avvio il collect di eventi
      collector.on('collect', async (reaction, user) => {
        // In base al tipo di reazione effettuo un processo di cambio pagina.
        if (reaction.emoji.name === 'ℹ️') {
          // Comando info
          const embed = new client._botMessageEmbed()
          embed.setDescription(
            'ℹ️ : Info comandi\n' +
              '❔ : Info composizione comandi\n' +
              '🔄 : Ricarica questo elemento\n' +
              '❌ : Elimina embed\n',
          )
          await queueEmbed.edit(`Descrizione comandi`, embed)
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === '❔') {
          // Question tab
          const embed = new client._botMessageEmbed()
          embed.setTitle('Come utilizzare il bot')
          embed.setDescription(
            '**Ciao! Benvenuto nella pagina della guida.**\n' +
              '**Come si usa questo bot?**\n' +
              'Leggere la firma del bot è piuttosto semplice.\n\n' +
              '**<argomento>**\n' +
              "Ciò significa che l'argomento è obbligatorio.\n\n" +
              '**[argomento]**\n' +
              "Ciò significa che l'argomento è facoltativo.\n\n" +
              '**"argomento"**\n' +
              "Ciò significa che l'argomento deve essere inserito tra doppie virgolette.\n\n" +
              '[A | B]\n' +
              'Ciò significa che può essere A o B.\n\n' +
              '**[argomento...]**\n' +
              'Ciò significa che puoi avere più argomenti.\n\n' +
              'il comando e il resto degli argomenti deve essere sempre separati da uno spazio\n',
          )
          await queueEmbed.edit(`Descrizione comandi`, embed)
          await reaction.users.remove(user.id)
        } else if (reaction.emoji.name === '🔄') {
          currentPage = 0
          await queueEmbed.edit(
            `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
            embeds[currentPage],
          )
          await reaction.users.remove(user.id)
        } else {
          collector.stop()
          await queueEmbed.delete()
          await message.delete()
        }
      })
    }
  }
}
