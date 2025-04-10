const http = require('http')
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors())

morgan.token('post', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


let persons = [
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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/people', (request, response) => {
  response.json(persons)
})

app.get('/api/people/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person){
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(
    `<div>\
      <p>Phonebook has info for ${persons.length} people</p>\
      <p>${new Date()}</p>\
    </div>`
  )
})

app.delete('/api/people/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/people', (request, response) => {
  body = request.body
  const note = {
    name: body.name,
    number: body.number,
    id: Math.random()

  }

  let repeat = false
  persons.forEach(person => {
    if (person.name === note.name){
      repeat = true
    }
  })

  if (note.name && note.number && !repeat) {
    response.json(note)
    persons = persons.concat(note)
  }
  else if (repeat) {
    return response.status(400).json({
      error: "repeated name"
    })
  }
  else if (!note.name) {
    return response.status(400).json({
      error: "no name"
    })
  }
  else if (!note.number) {
    return response.status(400).json({
      error: "no number"
  })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 