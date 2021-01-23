require('dotenv').config()

module.exports = {
    /**
     * Tipologie di utenti
     */
    rules: {
        'everyone': '@everyone', // Tutti gli utenti
        'Admin': 'Admin', // Solo utente Admin
        'Moderatore': 'Moderatore', // Solo utente Moderatore
        'Collaboratore': 'Collaboratore' // Solo Collaboratore
    },
    /**
     * Tipologia di task
     */
    taskType: {
        'AddReaction': 'AddReaction', // Aggiunta emoji
        'RemoveReaction': 'RemoveReaction', // Emoji Tolta
        'AddMessage': 'AddMessage' // Scrittura di un messaggio
    }
}