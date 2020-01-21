const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  persons = persons.filter(p => p.id !== id);
  return res.status(204).end()
})

app.post('/persons', (req, res) => {
  // create ID for entry
  const id = Math.floor(Math.random() * 1000000000);
  console.log('id: ', id);
  const newPerson = {
    id,
    ...req.body
  };
  persons.push(newPerson);
  res.json(persons);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
