const jwt = require('jsonwebtoken')
const notesRoute = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRoute.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

notesRoute.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    return authorization?.startsWith('Bearer ')
        ? authorization.replace('Bearer ', '')
        : null
}

notesRoute.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = body.userId
        ? [await User.findById(decodedToken.id)]
        : await User.find({username: 'root'})

    const trueUser = user[0]

    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: trueUser.id
    })
    
    const savedNote = await note.save()

    trueUser.notes = trueUser.notes.concat(savedNote._id)
    await trueUser.save()

    response.status(201).json(savedNote)
})

notesRoute.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

notesRoute.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRoute