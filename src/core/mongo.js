require('dotenv').config()
const mongoose = require('mongoose')
const Note = require('./model/note')
class Mongo {
  constructor(
    options = {
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  ) {
    this.options = options
    this.url = process.env.MONGO_URL
    this.mongo_db = process.env.MONGO_DB
    this.mongoose = mongoose
  }

  async init() {
    await this.mongoose.connect(this.url + '/' + this.mongo_db, this.options)
    this.db = await this.mongoose.connection
    this.db.on('error', console.error.bind(console, 'connection error:'))
    console.log('🚀 Connected a Mongo 👊🏻')
    /**
     *
     * @type {Note}
     */
    this.note = new Note(this.mongoose)
  }
}
module.exports = new Mongo()
