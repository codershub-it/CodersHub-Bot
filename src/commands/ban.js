const Commands = require('../core/command')
module.exports = class Ban extends Commands {

    constructor(client) {
        super(client)
        this.cmd = 'ban'
        this.alias = 'b'
        this.args = '[@nomeutente] [giorni di ban] [testo motivazione del ban]'
        this.example = `${ client.conf.prefix }ban @utente 3 Perché hai inserito testo scorretto troppe volte`
        this.description = 'Effettua un ban di un utente'
        this.timer = 0
        this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
        this.displayHelp = 1
    }

    async execution(message, bot) {

        const member = message.mentions.members.first()
        if (!member) {
            message.reply(` attenzione devi menzionare un utente`);
            return
        }

        let members = message.args.split(' ')[0]
        let day_ban = message.args.split(' ')[1]
        let reason_ban = message.args.split(' ')[2]
        let reason = message.args.replace(members,'').trim()
        reason = reason.replace(day_ban,'').trim()
        reason = reason.replace(reason_ban,'').trim()
        if (!reason) reason = `nessuna ragione`;

        if (typeof day_ban !== `string`) {
            message.reply(` attenzione devi inserire i giorni di ban es: ${ bot.conf.prefix }ban 4 perché si comporta male`);
            return
        }
        /**
         * Procedo con il sistema di ban
         */
        if (member && day_ban){
            member.ban({days: day_ban, reason: reason}).then((member) => {
                message.reply(`:wave: ${member.displayName} hai effettuato il ban con successo! https://gfycat.com/playfulfittingcaribou :point_right:`);
            }).catch(() => {
                message.reply(` non puoi bannare, mi dispiace`);
            });
        }
    }
}