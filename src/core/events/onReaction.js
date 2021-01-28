/**
 * Monitora quando si toglie una emoji
 * @param client
 */
function reactionRemove(client) {
  client.on('raw', () => {
    /**
     * Quando viene tolta una reazione
     */
    // if (raw.t === 'MESSAGE_REACTION_REMOVE') {
    // }
  })
}

/**
 * Monitora quando si aggiunge una emoji
 * @param client
 */
function reactionAdd(client) {
  client.on('raw', () => {
    /**
     * Quando viene aggiunta una reazione
     */
    // if (raw.t === 'MESSAGE_REACTION_ADD') {
    // }
  })
}

// /**
//  * Add Karma point!
//  * @param client
//  */
// function checkKarmaStar(client) {
//   client.on('messageReactionAdd', (reaction, user) => {
//     if (reaction.emoji.name === '⭐') {
//       client._botCommands['karma'].eventAddReaction(reaction, user)
//     }
//   })
// }

/**
 * Init
 * @param client
 */
function init(client) {
  reactionAdd(client)
  reactionRemove(client)
  // checkKarmaStar(client)
}

module.exports = { init }
