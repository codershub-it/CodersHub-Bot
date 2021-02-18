/**
 * Questa funzione verifica che non ci siano dei messaggi scaduti
 * @param client {module:"discord.js".Client} Client di discord
 * @param eventsModel Modello di estrazione degli eventi disponibili in mongo
 */
function checkClosedMessage(client, eventsModel) {
  eventsModel
    .getEvents(eventsModel.typeEvent.message)
    .then((docs) => {
      if (docs.length > 0) {
        docs.forEach((doc) => {
          if (doc) {
            // Estrapolo la lista dei comandi
            Object.values(client._botCommands).forEach((cmd) => {
              if (doc.cmd == cmd.cmd && new Date() > new Date(doc.date_end)) {
                // Avvio il metodo di chiusura di un determinato comando
                cmd.eventMessageClose(doc)
              }
            })
          }
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

/**
 * Questa funzione verifica che non ci siano dei reaction scaduti
 * @param client {module:"discord.js".Client} Client di discord
 * @param eventsModel Modello di estrazione degli eventi disponibili in mongo
 */
function checkClosedReaction(client, eventsModel) {
  eventsModel
    .getEvents(eventsModel.typeEvent.messageReactionAdd)
    .then((docs) => {
      if (docs.length > 0) {
        docs.forEach((doc) => {
          if (doc) {
            // Estrapolo la lista dei comandi
            Object.values(client._botCommands).forEach((cmd) => {
              if (doc.cmd == cmd.cmd && new Date() > new Date(doc.date_end)) {
                // Avvio il metodo di chiusura di un determinato comando
                cmd.eventReactionClose(doc)
              }
            })
          }
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

function init(client, eventsModel) {
  checkClosedMessage(client, eventsModel)
  checkClosedReaction(client, eventsModel)
}

module.exports = { init }
