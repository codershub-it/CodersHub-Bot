const Commands = require('../core/command')

module.exports = class Embed extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'embed'
    this.alias = 'em'
    this.args =
      "[#nome_canale (Opzionale)] Questo parametro serve a far stampare il messaggio in un'altro canale"
    this.example = `${client.conf.prefix}embed 123456789123`
    this.description =
      'Con questo comando scrivi un messaggio in embed allegando il file .json. Usa questo sito https://leovoel.github.io/embed-visualizer per creare il file json.'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    // Prendo id del canale
    const channelId = message.args.replace(/[^0-9]/g, '')

    // Verifico la presenza del canale
    if (!bot.channels.cache.get(channelId) && channelId) {
      message.reply(' il canale non esiste in questo server')
      return
    }

    // Estrapolo la lista file allegati
    const messageAttachments = message.attachments.toJSON()
    let embed = null

    // Estraggo i file allegati, il primo.
    if (messageAttachments.isArray || messageAttachments.length > 0) {
      const _maFileUrl = messageAttachments[0].url
      const _nameFile = messageAttachments[0].name

      // Verifico il formato del file
      if (_nameFile.split('.').pop() !== 'json') {
        // Errore formato file
        message.reply(' il formato del file è errato')
      }

      // Estraggo i dati dal file remoto
      if (_maFileUrl) {
        try {
          embed = await (await bot._botFetch(_maFileUrl)).json()
        } catch (e) {
          // Errore caricamento file
          message.reply(
            ` non è stato possibile caricare il file usa **${bot.conf.prefix}embed_exemple** per scaricare la demo`,
          )
        }
      }
    } else {
      message.reply(
        ` non hai caricato nessun file .json, **${bot.conf.prefix}embed_exemple** per scaricare la demo`,
      )
    }
    // Invia il messaggio al canale specifico
    if (channelId) {
      bot.channels.cache.get(channelId).send({ embed })
      message.reply(` messaggio inviato con successo nel canale: <#${channelId}>`)
      embed = null
    }
    if (embed) {
      message.channel.send({ embed }).catch((e) => {
        console.log(e)
      })
    }
  }
}
