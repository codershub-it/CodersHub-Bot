function init(client, eventsModel) {
  client.on('messageReactionAdd', (messageReaction, user) => {
    if (!user.bot) {
      eventsModel
        .getEventReaction(
          messageReaction.message.channel.id,
          messageReaction.message.id,
          eventsModel.typeEvent.messageReactionAdd,
          messageReaction._emoji.name,
        )
        .then((docs) => {
          if (docs.length > 0) {
            docs.forEach((doc) => {
              if (doc) {
                // Estrapolo la lista dei comandi
                Object.values(client._botCommands).forEach((cmd) => {
                  if (
                    doc.cmd == cmd.cmd &&
                    doc.emoji === messageReaction._emoji.name &&
                    new Date() < new Date(doc.date_end)
                  ) {
                    console.log('Reaction Add Function start')
                    cmd.eventReactionAdd(messageReaction, user, doc)
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
  })
  client.on('messageReactionRemove', (messageReaction, user) => {
    if (!user.bot) {
      eventsModel
        .getEventReaction(
          messageReaction.message.channel.id,
          messageReaction.message.id,
          eventsModel.typeEvent.messageReactionRemove,
          messageReaction._emoji.name,
        )
        .then((docs) => {
          if (docs.length > 0) {
            docs.forEach((doc) => {
              if (doc) {
                // Estrapolo la lista dei comandi
                Object.values(client._botCommands).forEach((cmd) => {
                  if (
                    doc.cmd == cmd.cmd &&
                    doc.emoji === messageReaction._emoji.name &&
                    new Date() < new Date(doc.date_end)
                  ) {
                    console.log('Reaction Remove Function start')
                    cmd.eventReactionRemove(messageReaction, user, doc)
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
  })
}
module.exports = { init }
