const mongoose = require('mongoose')
// Create a simple User's schema
const eventsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  date_added: { type: Date, default: Date.now },
  date_deleted: { type: Date, default: Date.now },
})
const titleFolder = 'Events'
const eventsModel = mongoose.model(titleFolder, eventsSchema)

// const addEvent = () => {}
// const getEvents = () => {}

module.exports = {
  eventsModel,
  // addEvent,
  // getEvents,
}
