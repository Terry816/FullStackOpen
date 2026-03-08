const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
app.use(express.static('dist'))

require('dotenv').config()
const Person = require('./models/person')
const person = require('./models/person')

morgan.token('personInfo', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personInfo'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', async (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }
  const nameExists = await Person.findOne({ name: body.name })

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person)
        return res.status(404).end()
      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})