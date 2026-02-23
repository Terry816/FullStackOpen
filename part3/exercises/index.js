const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')


let persons =
  [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

morgan.token('personInfo', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personInfo'))

function generateID() {
  return Math.floor(Math.random() * 10000)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find((p) => p.id === id)
  if (person) {
    res.json(person)
  } else {
    console.log("this ran");
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }
  else if (persons.find(x => x.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }


  const person = {
    id: generateID().toString(),
    name: body.name,
    number: body.number
  }
  persons.push(person)
  res.json(persons)

})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const exists = persons.some(person => person.id === id)

  if (!exists) {
    return res.status(404).json({ error: "person not found" })
  }

  persons = persons.filter((p) => p.id !== id)
  res.status(204).end()
})


const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})