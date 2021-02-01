/**
 * GetEventFromActionMessageReactionAdd
 * NOTA Questo processo deve essere asincrono
 * @param client
 */
function GetEventFromActionMessageReactionAdd(client, noteEvent) {
  const event = noteEvent.eventsType.messageReactionAdd
  client.on('messageReactionAdd', (reaction, user) => {
    // Estraggo gli eventi di questo utente
    noteEvent
      .getAuthorEvents(event, reaction.message.author_id)
      .then((document) => {
        if (document.length > 0) {
          for (let i = 0; i < document.length; i++) {
            // Verifico se ha una scadenza
            if (document[i].date_delete) {
              const date_delete = document[i].date_delete
              const date_now = new Date()
              // Se è scaduto lo elimino
              if (date_now > date_delete) {
                try {
                  noteEvent.deleteEvent(document[i]._id)
                } catch (e) {
                  console.log(e, 'EVENT_DELETE_MESSAGE_REACTION_ADD')
                }
              } else {
                // Se l'evento non è ancora scaduto
                client._botCommands[document[i].command].eventMessageReactionAdd(
                  reaction,
                  user,
                  document[i].level,
                )
              }
            } else {
              // Non ha una data di scadenza
              client._botCommands[document[i].command].eventMessageReactionAdd(
                reaction,
                user,
                document[i].level,
              )
            }
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  })
}
/**
 * GetEventFromActionMessageReactionRemove
 * NOTA Questo processo deve essere asincrono
 * @param client
 */
function GetEventFromActionMessageReactionRemove(client, noteEvent) {
  const event = noteEvent.eventsType.messageReactionRemove
  client.on('messageReactionRemove', (reaction, user) => {
    // Estraggo gli eventi di questo utente
    noteEvent
      .getAuthorEvents(event, reaction.message.author_id)
      .then((document) => {
        if (document.length > 0) {
          for (let i = 0; i < document.length; i++) {
            // Verifico se ha una scadenza
            if (document[i].date_delete) {
              const date_delete = document[i].date_delete
              const date_now = new Date()
              // Se è scaduto lo elimino
              if (date_now > date_delete) {
                try {
                  noteEvent.deleteEvent(document[i]._id)
                } catch (e) {
                  console.log(e, 'EVENT_DELETE_MESSAGE_REACTION_REMOVE')
                }
              } else {
                // Se l'evento non è ancora scaduto
                client._botCommands[document[i].command].eventMessageReactionRemove(
                  reaction,
                  user,
                  document[i].level,
                )
              }
            } else {
              // Non ha una data di scadenza
              client._botCommands[document[i].command].eventMessageReactionRemove(
                reaction,
                user,
                document[i].level,
              )
            }
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  })
}
/**
 * GetEventFromMessage
 * NOTA Questo processo deve essere asincrono
 * @param client
 */
function GetEventFromMessage(client, noteEvent) {
  const event = noteEvent.eventsType.message
  client.on('message', (message) => {
    // Estraggo gli eventi di questo utente
    noteEvent
      .getAuthorEvents(event, message.author_id)
      .then((document) => {
        if (document.length > 0) {
          for (let i = 0; i < document.length; i++) {
            // Verifico se ha una scadenza
            if (document[i].date_delete) {
              const date_delete = document[i].date_delete
              const date_now = new Date()
              // Se è scaduto lo elimino
              if (date_now > date_delete) {
                try {
                  noteEvent.deleteEvent(document[i]._id)
                } catch (e) {
                  console.log(e, 'EVENT_DELETE_MESSAGE')
                }
              } else {
                // Se l'evento non è ancora scaduto
                client._botCommands[document[i].command].eventMessage(message, document[i].level)
              }
            } else {
              // Non ha una data di scadenza
              client._botCommands[document[i].command].eventMessage(message, document[i].level)
            }
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  })
}

/**
 * Init
 * @param client
 */
function init(client, noteEvent) {
  GetEventFromActionMessageReactionAdd(client, noteEvent)
  GetEventFromActionMessageReactionRemove(client, noteEvent)
  GetEventFromMessage(client, noteEvent)
}

module.exports = {
  init,
}
