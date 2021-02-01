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
   * Canali fissi per il bot
   */
  channel: {
    suggerimenti_id: process.env.SUGGERIMENTI_CANALE,
    comandi_bot_id: process.env.COMANDI_BOT_CANALE,
  },
}
