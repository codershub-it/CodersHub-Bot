const mongoose = require('mongoose')
const NoteModel = require('../note')
const MongoURI = require('../../../../globalConfig.json')
const noteData = {
  guild_id: '12345',
  channel_id: '12345',
  message_id: '12345',
  author_id: '12345',
  note: 'test',
  status: false,
}

describe('User Model Test', () => {
  // Connect to MongoDB
  beforeAll(async () => {
    await mongoose.connect(
      MongoURI.mongoUri,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      },
    )
  })

  it('create & save note successfully', async () => {
    const validNote = new NoteModel(noteData)
    const savedNote = await validNote.save()
    expect(savedNote._id).toBeDefined()
    expect(savedNote.guild_id).toBe(noteData.guild_id)
  })

  it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
    const noteWithInvalidField = new NoteModel({
      guild_id: '12345',
      channel_id: '12345',
      message_id: '12345',
      author_id: '12345',
      nickname: 'elemento non necessario...',
    })
    const saveNoteWithInvalidField = await noteWithInvalidField.save()
    expect(saveNoteWithInvalidField._id).toBeDefined()
    expect(saveNoteWithInvalidField.nickkname).toBeUndefined()
  })

  it('create user without required field should failed', async () => {
    const noteWithoutRequiredField = new NoteModel({ guild_id: '1234' })
    let err
    try {
      await noteWithoutRequiredField.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors).toBeDefined()
  })
})
