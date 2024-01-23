const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://vakkariadev:${password}@cluster0.tppxcxv.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const noteOne = new Note({
    content: 'HTML is easy',
    date: new Date(),
    important: true
})

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

noteOne.save().then(result => {
    console.log('note saved!')
})

const noteTwo = new Note({
    content: 'Mongoose makes things easier',
    date: new Date(),
    important: true
})

noteTwo.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})