function init(client) {
  client.on('error', (err) => {
    console.log(err)
  })
}

module.exports = { init }
