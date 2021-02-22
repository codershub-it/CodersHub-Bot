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
            getEventReactionAddFromDocs(client, docs, messageReaction, user)
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
            getEventReactionRemoveFromDocs(client, docs, messageReaction, user)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  })
}

function getEventReactionAddFromDocs(client, docs, messageReaction, user) {
  docs.forEach((doc) => {
    if (doc) {
      // Estrapolo la lista dei comandi
      Object.values(client._botCommands).forEach((cmd) => {
        if (
          doc.cmd === cmd.cmd &&
          doc.emoji === messageReaction._emoji.name &&
          new Date() < new Date(doc.date_end)
        ) {
          cmd.eventReactionAdd(messageReaction, user, doc)
        }
      })
    }
  })
}

function getEventReactionRemoveFromDocs(client, docs, messageReaction, user) {
  docs.forEach((doc) => {
    if (doc) {
      // Estrapolo la lista dei comandi
      Object.values(client._botCommands).forEach((cmd) => {
        if (
          doc.cmd === cmd.cmd &&
          doc.emoji === messageReaction._emoji.name &&
          new Date() < new Date(doc.date_end)
        ) {
          cmd.eventReactionRemove(messageReaction, user, doc)
        }
      })
    }
  })
}

module.exports = { init }
