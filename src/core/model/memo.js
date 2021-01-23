/**
 * _id // Riferimento univoco
 * member_id // Riferimento utente che ha inserito la memo
 * guild_id // Riferimento del gruppo
 * channel_id // Riferimento del canale
 * message_id // Riferimento del messaggio
 * note // Memo sulla nota
 */

class Memo {
    constructor(db) {
        this.collection = db.collection('memos');
    }
    async addMemo(user) {
        const newUser = await this.collection.insertOne(user);
        return newUser;
    }

    async getMemoFromId(_id) {
        const value_memo = await this.collection.find({ _id: _id })
    }

    async getMemoFrom() {

    }
}
module.exports = Users;