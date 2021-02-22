const Canvas = require('canvas')
const Commands = require('../../core/command')
const Discord = require('discord.js')

module.exports = class Image extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'image'
    this.alias = 'img'
    this.args = ''
    this.example = ''
    this.description = ''
    this.timer = 0
    this.access = []
    this.displayHelp = 0
    this.client = client
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message) {
    const canvas = Canvas.createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    const background = await Canvas.loadImage('./static/wallpaper-1.jpg')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#74037b'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Slightly smaller text placed above the member's display name
    ctx.font = '28px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Ciao,', canvas.width / 2.5, canvas.height / 3.5)

    // Add an exclamation point here and below
    ctx.font = this.applyText(canvas, `${message.member.displayName}!`)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${message.member.displayName}!`, canvas.width / 2.5, canvas.height / 2)

    ctx.font = this.applyText(canvas, `Benvenuto nel mondo di CodersHub!`)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Benvenuto nel mondo di CodersHub!`, canvas.width / 2.5, canvas.height / 1.5)

    ctx.beginPath()
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' }))
    ctx.drawImage(avatar, 25, 25, 200, 200)

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png')
    await message.channel.send(`Ciao, ${message.member}!`, attachment)
  }

  // Pass the entire Canvas object because you'll need to access its width, as well its context
  applyText(canvas, text) {
    const ctx = canvas.getContext('2d')
    // Declare a base size of the font
    let fontSize = 70
    do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${(fontSize -= 10)}px sans-serif`
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300)
    // Return the result to use in the actual canvas
    return ctx.font
  }
}
