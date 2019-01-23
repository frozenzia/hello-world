const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morg = require('morgan');
const cors = require('cors');
const Folk = require('./models/folk');

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
morg.token('content', req => {
    return JSON.stringify(req.body);
})

app.use(morg(':method :url :content :status :res[content-length] - :response-time ms'));

app.get('/info', (req, res) => {
    Folk
        .find({}, { __v: 0 })
        .then(folksDB => {
            numFolks = folksDB.length;
            res.send(`<p>puhelinluettelossa ${numFolks} henkilön tiedot</p><p>${Date()}</p>`);
        });
})

app.get('/api/persons', (req, res) => {
    Folk
        .find({}, { __v: 0 })
        .then(folksDB => res.json(folksDB.map(Folk.formatFolk)));
})

app.get('/api/persons/:id', (req, res) => {
    Folk
        .findById(req.params.id, { __v: 0 })
        .then(folksDB => {
            if (folksDB) {
                res.json(Folk.formatFolk(folksDB));
            } else {
                console.log('folksDB: ', folksDB);
                res.status(404).end();
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        });
})

app.post('/api/persons', (req, res) => {
    const {name, phone} = req.body;
    if (name && phone) {
        console.log('checking for existing');
        const regex = new RegExp(name, "i");
        Folk
            .find({ name: regex }, { __v: 0 })
            .then(folksDB => {
                console.log('searching for', name, ' results are: ', folksDB);
                return (folksDB.length > 0) ? true : false;
            })
            .then(personExists => {
                if (personExists) {
                    error = 'nimi on oltava yksiselitteinen';
                    res.status(403).json({ error });
                } else {
                    const folk = new Folk({ name, phone });
                    folk
                        .save()
                        .then(savedFolk => {
                            res.json(Folk.formatFolk(savedFolk));
                        });
                }
            });
    } else {
        let error = '';
        if (!name) error = 'nimi puuttuu';
        else error = 'puhelinnumero puutuu';
        res.status(400).json({ error });
    }
})

app.delete('/api/persons/:id', (req, res) => {
    Folk
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' });
        });
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body;
    const folk = {
        name: body.name,
        phone: body.phone
    };

    Folk
        .findByIdAndUpdate(req.params.id, folk, { new: true }) // send back the NEW record
        .then(updatedFolk => {
            res.json(Folk.formatFolk(updatedFolk));
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ error: 'malformatted id' });
        });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
