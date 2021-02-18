const mongoose = require('mongoose')
const debug = require('debug')(`${process.env.DEBUG_PREFIX}:mongo`)

/**
 * Driver per mongo
 */
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
    this.mongoose = mongoose
  }

  async init() {
    await this.mongoose.connect(this.url, this.options)
    this.db = await this.mongoose.connection
    this.db.on('error', console.error.bind(console, 'connection error:'))
    debug('🚀 Connected a Mongo 👊🏻')
  }

  async disconnect() {
    await this.mongoose.connection.close()
  }

  async removeAllCollections() {
    const collections = Object.keys(this.mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = this.mongoose.connection.collections[collectionName]
      await collection.deleteMany()
    }
  }
}
module.exports = new Mongo()
