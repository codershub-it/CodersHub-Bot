const mongoose = require('mongoose')
// Create a simple User's schema
const eventsSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  karma_point: { type: String, required: true },
  users: { type: Array },
})
const titleFolder = 'KarmaPoints'
const karmaModel = mongoose.model(titleFolder, eventsSchema)

module.exports = {
  karmaModel,
}
