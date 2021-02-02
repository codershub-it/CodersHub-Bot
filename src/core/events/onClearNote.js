const noteModel = require('../model/note')
function init(client) {
  // Estrapolo tutti gli eventi
  // https://discord.com/developers/docs/topics/gateway#payloads
  client.on('raw', async (raw) => {
    // Quando viene eliminato un messaggio
    if (raw.t === 'MESSAGE_DELETE') {
      noteModel.deleteMany(
        {
          guild_id: raw.d.guild_id,
          channel_id: raw.d.channel_id,
          message_id: raw.d.id,
        },
        {},
        (err) => {
          if (err) console.log(err.message)
        },
      )
    }
    // Quando viene eliminato un canale
    if (raw.t === 'CHANNEL_DELETE') {
      noteModel.deleteMany(
        {
          guild_id: raw.d.guild_id,
          channel_id: raw.d.id,
        },
        {},
        (err) => {
          if (err) console.log(err.message)
        },
      )
    }
  })
}

module.exports = { init }
