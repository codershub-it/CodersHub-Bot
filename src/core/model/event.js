const mongoose = require('mongoose')

// Tipi di evento
const eventsType = {
  messageReactionAdd: 'messageReactionAdd',
  messageReactionRemove: 'messageReactionRemove',
  message: 'message',
}

// Create a simple User's schema
const eventsSchema = new mongoose.Schema({
  // Tipo evento
  type: { type: String, required: true },
  // Autore del messaggio
  author_id: { type: String, required: true },
  // Client del evento
  user: { type: Object, required: true },
  // Message del evento
  message: { type: Object, required: true },
  // Name del comando
  command: { type: String, required: true },
  // Stadio di profondità della richiesta se aspetta più cose dall'utente
  level: { type: Number, default: 0 },
  // Options.. varie ed eventuali..
  option: { type: Object, default: {} },
  // Data scadenza evento non obbligatoria
  date_delete: { type: Date, default: Date.now },
})

// Titolo del folder
const titleFolder = 'Events'
/**
 * Modello
 * @type {Model<Document>}
 */
const eventsModel = mongoose.model(titleFolder, eventsSchema)

/**
 * Salva un evento nel database
 * @param type
 * @param user
 * @param command
 * @param level
 * @param date_delete
 * @returns {Promise<Document<any>>}
 */
const addEvent = (type, user, command, level, date_delete = null) => {
  const obj = {
    type: type,
    user: user,
    command: command,
    level: level,
  }
  // Aggiungo la scadenza se presente.
  if (date_delete) {
    obj['date_delete'] = date_delete
  }
  // Salvo questo evento
  const newModel = this.eventsModel(obj)
  return newModel.save()
}

/**
 * Estrapola tutti gli eventi che hanno questo come riferimento e utente
 * @param type
 * @param author_id
 * @returns {Promise<[Document] | null, [Document]>}
 */
const getAuthorEvents = (type, author_id) => {
  return new Promise((resolve, reject) => {
    eventsModel.find(
      {
        $and: [{ type: type }, { author_id: author_id }],
      },
      (err, docs) => {
        if (err) reject(err)
        resolve(docs)
      },
    )
  })
}

/**
 * Elimina un evento
 * @param _id Riferiment del evento
 * @returns {Query<Document | null, Document>}
 */
const deleteEvent = (_id) => {
  return this.eventsModel.findByIdAndDelete(_id)
}

module.exports = {
  eventsModel,
  eventsType,
  deleteEvent,
  addEvent,
  getAuthorEvents,
}
