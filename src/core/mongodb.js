require('dotenv').config()
const { MongoClient } = require('mongodb')
const config = {
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const Users = require('./model/users')

class MongoBot {
  constructor() {
    const url = process.env.MONGO_URL
    this.client = new MongoClient(url, config)
  }
  async init() {
    await this.client.connect()
    console.log('Connected a MongoDB')
    this.db = this.client.db(process.env.MONGO_DB)
    this.Users = new Users(this.db)
  }
}

module.exports = new MongoBot()
