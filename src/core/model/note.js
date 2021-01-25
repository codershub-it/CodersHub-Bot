/**
 * _id // Riferimento univoco
 * member_id // Riferimento utente che ha inserito la memo
 * guild_id // Riferimento del gruppo
 * channel_id // Riferimento del canale
 * message_id // Riferimento del messaggio
 * note // Memo sulla nota
 */

module.exports = class Note {
  constructor(mongoose) {
    this.mongoose = mongoose
    this.noteModel = this.mongoose.model('Note', this.createSchema())
  }

  /**
   * Salva una memo
   * @param guild_id {String}
   * @param channel_id {String}
   * @param message_id {String}
   * @param author_id {String}
   * @param note {String}
   * @param status {Boolean}
   * @returns {Promise<Object>}
   */
  async saveNote(guild_id, channel_id, message_id, author_id, note, status) {
    return new Promise((resolve, reject) => {
      const element = new this.noteModel({
        guild_id: guild_id,
        channel_id: channel_id,
        message_id: message_id,
        author_id: author_id,
        note: note,
        status: status,
      })
      element.save((err, resp) => {
        if (err) {
          reject(err)
        }
        resolve(resp)
      })
    })
  }

  createSchema() {
    return new this.mongoose.Schema({
      guild_id: String,
      channel_id: String,
      message_id: String,
      author_id: String,
      note: String,
      date_added: { type: Date, default: Date.now },
      date_modified: { type: Date, default: Date.now },
      status: Boolean,
    })
  }
}
