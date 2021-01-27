const Discord = require('discord.js')
require('dotenv').config()
const Bot = require('./src/index')

const client = new Discord.Client()
client.login(process.env.TOKEN_BOT).catch((e) => {
  console.log(e)
})

new Bot(client)
