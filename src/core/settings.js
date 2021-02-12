require('dotenv').config()

module.exports = {
  /**
   * Tipologie di utenti
   */
  rules: {
    everyone: process.env.ROLE_EVERYONE_ID,
    Admin: process.env.ROLE_ADMIN_ID,
    Moderatore: process.env.ROLE_MODERATORE_ID,
    Collaboratore: process.env.ROLE_COLLABORATORE_ID,
  },
  /**
   * Tipologia di task
   */
  taskType: {
    AddReaction: 'AddReaction',
    RemoveReaction: 'RemoveReaction',
    AddMessage: 'AddMessage',
  },
  /**
   * Canali fissi per il bot
   */
  channel: {
    suggerimenti_id: process.env.SUGGERIMENTI_CANALE,
    comandi_bot_id: process.env.COMANDI_BOT_CANALE,
    impostazione_ruoli_id: process.env.IMPOSTAIZONE_RUOLI_CANALE,
    event_id: process.env.EVENT_CANALE,
  },
  server_id: process.env.SERVER_ID,
  role_notification_index: process.env.ROLE_NOTIFICATION_INDEX,
  role_category_index: process.env.ROLE_CATEGORY_INDEX,
}
