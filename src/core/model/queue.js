const mongoose = require('mongoose')

/**
 * Schema del model
 * @type {module:mongoose.Schema<Document, Model<Document>>}
 */
const queueSchema = new mongoose.Schema({
  cmd: { type: String },
  typeEvent: { type: String },
  channel_id: { type: String },
  message_id: { type: String },
  author_id: { type: String },
  data: { type: Object },
  date_end: { type: Date },
})

/**
 * Nome della tabella
 * @type {string}
 */
const titleFolder = 'Queue'

/**
 * Model
 * @type {Model<Document>}
 */
const queueModel = mongoose.model(titleFolder, queueSchema)

/**
 * Tipi di Eventi Monitorati con la Queue
 * @type {{messageDelete: string, messageReactionRemove: string, messageUpdate: string, message: string, guildMemberAdd: string, messageReactionAdd: string, guildMemberRemove: string}}
 */
const event = {
  message: 'message',
  messageDelete: 'messageDelete',
  messageUpdate: 'messageUpdate',
  messageReactionAdd: 'messageReactionAdd',
  messageReactionRemove: 'messageReactionRemove',
  guildMemberAdd: 'guildMemberAdd',
  guildMemberRemove: 'guildMemberRemove',
}

/**
 * Questo metodo crea una queue
 * @param cmd {Sting} Il riferimento del comando che ha inserito la queue
 * @param typeEvent {Event} Tipo di evento che deve vedere
 * @param value {Object} Un recipiente di dati sono le opzioni del queue
 * @param value.channel_id {String}
 * @param value.message_id {String}
 * @param value.author_id {String}
 * @param value.date_end {Number}
 * @param value.data {Object}
 * @returns {Promise<Document<any>>}
 */
const saveQueue = async (cmd, typeEvent, value) => {
  // Verifico i parametri obbligatori
  if (!cmd) throw new Error('cmd è necessario')
  if (!typeEvent) throw new Error('typeEvent è necessario')
  if (typeof value !== 'object') throw new Error('value deve essere un oggetto')
  // Creo oggetto vuoto
  const obj = {
    cmd: cmd,
    typeEvent: typeEvent,
  }
  // Popolo obj
  if (value.date_end) obj.date_end = new Date(Date.now() + value.date_end)
  if (value.channel_id) obj.channel_id = value.channel_id
  if (value.author_id) obj.author_id = value.author_id
  if (value.message_id) obj.message_id = value.message_id
  if (value.data) obj.data = value.data
  // Salvo la Queue
  const _queueModel = new queueModel()
  return _queueModel.save()
}

/**
 * Estrapolo la queue
 * @param cmd {Sting} Il riferimento del comando che ha inserito la queue
 * @param channel_id{String} Canale dove è stato mandato il comando
 * @param author_id {String} Autore del comando
 * @param typeEvent {Event} Tipo di evento che deve vedere
 * @returns {Query<Array<Document>, Document>}
 */
const getQueue = (cmd, channel_id, author_id, typeEvent) => {
  // Estrazione della queue
  return new Promise((resolve, reject) => {
    queueModel.find(
      {
        $and: [
          { cmd: cmd },
          { channel_id: channel_id },
          { author_id: author_id },
          { typeEvent: typeEvent },
        ],
      },
      (err, docs) => {
        if (err) reject(err)
        resolve(docs)
      },
    )
  })
}

const cleanQueues = () => {
  return new Promise((resolve, reject) => {
    queueModel.find({}, (err, docs) => {
      if (err) reject(err)
      docs.forEach((doc) => {
        if (new Date() > new Date(doc.date_end)) {
          // Elimino l'elemento
          queueModel
            .findOneAndDelete({ _id: doc._id })
            .exec()
            .then((_doc) => {
              resolve(_doc)
            })
            .catch((e) => {
              console.log(e)
            })
        }
      })
    })
  })
}

/**
 * Elimino una queue
 * @param _id
 * @returns {Query<Document | null, Document>}
 */
const deleteQueue = (_id) => {
  return queueModel.findOneAndDelete({ _id: _id }).exec()
}

module.exports = {
  event,
  saveQueue,
  getQueue,
  deleteQueue,
  cleanQueues,
}
