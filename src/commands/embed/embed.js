const Commands = require('../../core/command')

module.exports = class Embed extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'embed'
    this.alias = 'em'
    this.args = '[Oggetto messaggio] [#nome_canale (Opzionale)]'
    this.example = `${client.conf.prefix}embed 123456789123`
    this.description =
      'Con questo comando scrivi un messaggio in embed allegando il file .json. Usa questo sito https://leovoel.github.io/embed-visualizer per creare il file json.'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    let channel_id = null
    // Estraggo il canale menzionato
    if (message.mentions) {
      message.mentions._channels.map((testChannel) => {
        channel_id = testChannel.id
      })
    }
    // Verifico la presenza del canale
    if (!bot.channels.cache.get(channel_id) && channel_id) {
      message.reply(' il canale non esiste in questo server')
      return
    }

    let jsonFile = {}
    // Estrapolo la lista file allegati
    const messageAttachments = message.attachments.toJSON()
    // Estraggo i file allegati, il primo.
    if (messageAttachments.isArray || messageAttachments.length > 0) {
      const _maFileUrl = messageAttachments[0].url
      const _nameFile = messageAttachments[0].name
      // Verifico il formato del file
      if (_nameFile.split('.').pop() !== 'json') {
        // Errore formato file
        message.reply(' il formato del file è errato')
        return
      }
      // Estraggo i dati dal file remoto
      if (_maFileUrl) {
        try {
          jsonFile = await (await bot._botFetch(_maFileUrl)).json()
        } catch (e) {
          // Errore caricamento file
          message.reply(
            ` non è stato possibile caricare il file usa **${bot.conf.prefix}embed_exemple** per scaricare la demo`,
          )
          return
        }
      }
    } else {
      message.reply(
        ` non hai caricato nessun file .json, **${bot.conf.prefix}embed_exemple** per scaricare la demo`,
      )
      return
    }

    const embed = jsonFile.embed

    // Invia il messaggio al canale specifico
    if (channel_id) {
      bot.channels.cache.get(channel_id).send(jsonFile.content, { embed })
      message.reply(` messaggio inviato con successo nel canale: <#${channel_id}>`)
      return
    }

    if (jsonFile) {
      message.channel.send(jsonFile.content, { embed }).catch((e) => {
        console.log(e)
      })
    }
  }
}
