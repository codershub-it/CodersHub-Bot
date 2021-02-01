const Commands = require('../../core/command')

module.exports = class Embed extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'embed'
    this.alias = 'em'
    this.args = '[Oggetto messaggio] [#nome_canale (Opzionale)]'
    this.example = `${client.conf.prefix}embed #nome_canale`
    this.description =
      'Con questo comando scrivi un messaggio in embed allegando il file .json. Usa questo sito https://leovoel.github.io/embed-visualizer per creare il file json. Puoi aggiungere un ulteriore argomento:  #nome_canale, dove verrà inviato il messaggio embedded'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Moderatore,
      client._botSettings.rules.Collaboratore,
    ]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    const [rawChannelId, ...otherArgs] = message.args.trim().split(' ')

    if (otherArgs && otherArgs.some((x) => !!x)) {
      message.reply(' puoi usare solamente un argomento opzionale: #nome_canale')
      message.delete()
      return
    }

    const channelId = rawChannelId ? rawChannelId.match(/[0-9]/g).join('') : ''

    // Verifico la presenza del canale
    if (channelId && !bot.channels.cache.get(channelId)) {
      message.reply(' il canale non esiste in questo server')
      message.delete()
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
        message.delete()
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
          message.delete()
          return
        }
      }
    } else {
      message.reply(
        ` non hai caricato nessun file .json, **${bot.conf.prefix}embed_exemple** per scaricare la demo`,
      )
      message.delete()
      return
    }

    const embed = jsonFile.embed

    // Invia il messaggio al canale specifico
    if (channelId) {
      bot.channels.cache.get(channelId).send(jsonFile.content, { embed })
      message.reply(` messaggio inviato con successo nel canale: <#${channelId}>`)
      message.delete()
      return
    }

    if (jsonFile) {
      message.channel
        .send(jsonFile.content, { embed })
        .catch((e) => {
          console.log(e)
          message.reply(
            ` errore nell'invio del messaggio embedded, hai allegato un json con il formato corretto?`,
          )
        })
        .finally(() => message.delete())
    }
  }
}
