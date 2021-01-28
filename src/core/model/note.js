const mongoose = require('mongoose')
// Create a simple User's schema
const noteSchema = new mongoose.Schema({
  guild_id: { type: String, required: true },
  channel_id: { type: String, required: true },
  message_id: { type: String, required: true },
  author_id: { type: String, required: true },
  note: String,
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
  status: { type: Boolean, default: true, required: true },
})
const titleFolder = 'Notes'
const noteModel = mongoose.model(titleFolder, noteSchema)
module.exports = noteModel
