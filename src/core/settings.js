require('dotenv').config()

module.exports = {
  /**
   * Tipologie di utenti
   */
  rules: {
    everyone: '@everyone',
    Admin: 'Admin',
    Moderatore: 'Moderatore',
    Collaboratore: 'Collaboratore',
  },
  /**
   * Tipologia di task
   */
  taskType: {
    AddReaction: 'AddReaction',
    RemoveReaction: 'RemoveReaction',
    AddMessage: 'AddMessage',
  },
  channel: {
    suggerimenti_id: '802929607039909898',
    comandi_bot_id: '802951431455637524',
  },
}
