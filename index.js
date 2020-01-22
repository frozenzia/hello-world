const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express();
app.use(cors());
app.use(bodyParser.json());

morgan.token('content', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

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
  const personToFind = persons.find(p => p.id === id);
  if (personToFind) return res.json(personToFind)
  // else
  return res.status(404).end()
})

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);
  return res.status(204).end()
})

app.post('/persons', (req, res) => {
  const newPerson = {
    ...req.body
  };
  let error = '';
  if ( newPerson.name && newPerson.name !== ''
    && newPerson.phone && newPerson.phone !== '') {
      const newName = newPerson.name.toLowerCase();
      if (persons.find(p => p.name.toLowerCase() === newName) === undefined) {
        // create ID for entry
        const id = Math.floor(Math.random() * 1000000000);
        newPerson.id = id;
        persons.push(newPerson);
        return res.json(persons);
      } else {
        // name must be unique!
        error = 'name must be unique'
      }
  } else {
    // something's missing!
    error = 'request must include both a non-empty "name" and a non-empty "phone" field';
  }
  return res.status(400).json({ error })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
