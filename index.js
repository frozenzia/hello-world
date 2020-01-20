const express = require('express');
const app = express();

let persons = [
  {
    "name": "Arto Hellas",
    "phone": "040-123456",
    "id": 1
  },
  {
    "name": "Dan Abramov",
    "phone": "123-456-789",
    "id": 3
  },
  {
    "name": "Donna Poppendieck",
    "phone": "123-456-789",
    "id": 4
  },
  {
    "name": "BJ Hunnicut",
    "phone": "55555",
    "id": 5
  }
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${Date()}</p>`
  )
})

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const personToFind = persons.find(p => p.id === id);
  if (personToFind) return res.json(personToFind)
  // else
  return res.status(404).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
