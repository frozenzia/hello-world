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

app.get('/persons', (req, res) => {
  res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
