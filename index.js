const Discord = require('discord.js')
require('dotenv').config()
const Bot = require('./src/index')
const mongo = require('./src/core/mongo')
process.env.TZ = process.env.TIME_ZONE
mongo.init().then(() => {
  const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
  client.login(process.env.TOKEN_BOT).catch((e) => {
    console.log(e)
  })

  new Bot(client, mongo)
})
