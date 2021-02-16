const mongoose = require('mongoose')
/**
 * Schema struttura del documento
 * @type {module:mongoose.Schema<Document, Model<Document>, undefined>}
 */
const eventSchema = new mongoose.Schema({
  // Comando dello step
  cmd: { type: String, required: true },
  // Tipo di richiesta in ascolto anche più di uno
  event: [{ type: String, required: true }],
  // Canale di ascolto
  channel_id: { type: String },
  // Messaggio di ascolto
  message_id: { type: String },
  // Autore in ascolto
  author_id: { type: String },
  // Emoji
  emoji: { type: String },
  // Altre opzioni o valori
  options: { type: Object },
  // Data di scadenza dello step
  date_end: { type: Date },
})
/**
 * Titolo della cartella
 * @type {string}
 */
const titleFolder = 'Event'
/**
 * Tipo di evento
 * @type {{messageDelete: string, messageReactionRemove: string, messageUpdate: string, message: string, guildMemberAdd: string, messageReactionAdd: string, guildMemberRemove: string}}
 */
const typeEvent = {
  message: 'message',
  messageDelete: 'messageDelete',
  messageUpdate: 'messageUpdate',
  messageReactionAdd: 'messageReactionAdd',
  messageReactionRemove: 'messageReactionRemove',
  guildMemberAdd: 'guildMemberAdd',
  guildMemberRemove: 'guildMemberRemove',
}

const eventModel = mongoose.model(titleFolder, eventSchema)

/**
 * Questo metodo crea una event
 * @param value {Object} Un recipiente di dati sono le opzioni del event
 * @param value.cmd {Sting} Il riferimento del comando che ha inserito la event
 * @param value.event {String} Tipo di evento che deve vedere
 * @param value.channel_id {String}
 * @param value.message_id {String}
 * @param value.author_id {String}
 * @param value.date_end {Number}
 * @param value.options {Object}
 * @param value.emoji {String}
 * @returns {Promise<Document<any>>}
 */
const saveEvent = async (value) => {
  // Creo oggetto vuoto
  const obj = {}
  // Verifico parametri obbligatori
  if (!value.cmd) throw new Error('cmd è obbligatorio')
  if (!value.event) throw new Error('typeEvent è obbligatorio')
  // Popolo obj
  if (value.cmd) obj.cmd = value.cmd
  if (value.event) obj.event = value.event
  if (value.date_end) obj.date_end = new Date(Date.now() + value.date_end)
  if (value.channel_id) obj.channel_id = value.channel_id
  if (value.author_id) obj.author_id = value.author_id
  if (value.message_id) obj.message_id = value.message_id
  if (value.options) obj.options = value.options
  if (value.emoji) obj.emoji = value.emoji
  // Salvo la event
  const _eventModel = new eventModel(obj)
  return _eventModel.save()
}

/**
 * Estrapola le event che un utente deve processare
 * @param channel_id{String} Canale dove è stato mandato il comando
 * @param author_id {String} Autore del comando
 * @param typeEvent {Event} Tipo di evento che deve vedere
 * @returns {Query<Array<Document>, Document>}
 */
const getEventMessage = (channel_id, author_id, event) => {
  return new Promise((resolve, reject) => {
    eventModel.find(
      {
        $and: [{ channel_id: channel_id }, { author_id: author_id }, { event: event }],
      },
      (err, docs) => {
        if (err) reject(err)
        resolve(docs)
      },
    )
  })
}

/**
 * Estrapola tutte le event di reaction
 * @param channel_id {String} Canale del messaggio
 * @param message_id {String} Riferimento del messaggio
 * @param event {string} Tipo di evento
 * @param emoji {String} Emoji da cercare
 * @returns {Query<Array<Document>, Document>}
 */
const getEventReaction = (channel_id, message_id, event, emoji) => {
  return new Promise((resolve, reject) => {
    eventModel.find(
      {
        $and: [
          { channel_id: channel_id },
          { message_id: message_id },
          { event: event },
          { emoji: emoji },
        ],
      },
      (err, docs) => {
        if (err) reject(err)
        resolve(docs)
      },
    )
  })
}

/**
 * Aggiorna un evento già esistente
 * @param _id
 * @param body
 * @return {Promise<unknown>}
 */
const updateEvent = (_id, body) => {
  return new Promise((resolve, reject) => {
    eventModel.findByIdAndUpdate(_id, body, { useFindAndModify: false }, (err, docs) => {
      if (err) reject(err)
      resolve(docs)
    })
  })
}

/**
 * Elimino una event
 * @param _id
 * @returns {Query<Document | null, Document>}
 */
const deleteEvent = (_id) => {
  return eventModel.findOneAndDelete({ _id: _id }).exec()
}

module.exports = {
  typeEvent,
  saveEvent,
  getEventMessage,
  getEventReaction,
  updateEvent,
  deleteEvent,
}
