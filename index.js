const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morg = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
morg.token('content', req => {
    return JSON.stringify(req.body);
})

app.use(morg(':method :url :content :status :res[content-length] - :response-time ms'));

let folks = [
    {
      "name": "Arto Hellas",
      "phone": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "phone": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "phone": "040-123456",
      "id": 3
    },
    {
      "name": "Lea KutvAAAAnen",
      "phone": "040-123456",
      "id": 4
    }
];

app.get('/info', (req, res) => {
    numFolks = folks.length;
    res.send(`<p>puhelinluettelossa ${numFolks} henkilön tiedot</p><p>${Date()}</p>`);
})

app.get('/api/persons', (req, res) => {
    res.json(folks);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const folk = folks.find(f => f.id === id);
    if (folk) {
        res.json(folk);
    } else {
        console.log('folk: ', folk);
        res.status(404).end();
    }
})

app.post('/api/persons', (req, res) => {
    const id = Math.floor(Math.random() * 500000);
    const {name, phone} = req.body;
    if (name && phone && !_alreadyExists(name)) {
        const folk = { id, name, phone };
        folks = folks.concat(folk);
        res.json(folk);
    } else {
        let error = '';
        if (!name) error = 'nimi puuttuu';
        else if (!phone) error = 'puhelinnumero puutuu';
        else error = 'nimi on oltava yksiselitteinen';
        res.status(400).json({ error });
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    folks = folks.filter(f => f.id !== id);
    res.status(204).end();
})

const _alreadyExists = name => {
    console.log('checking for existing');
    return (folks.findIndex(f => f.name.toLowerCase() === name.toLowerCase()) > -1);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
