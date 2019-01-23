const mongoose = require('mongoose');

mongoose.connect(url, { useNewUrlParser: true });

const Folk = mongoose.model('Folk', {
    name: String,
    phone: String
});

// process.argv[0] and [1] are path-to-node and path-to-this-file
if (process.argv.length === 4) {
    const [,,name, phone] = process.argv;
    const folk = new Folk({
        name,
        phone
    });

    folk
        .save()
        .then(resp => {
            console.log(`lisätään henkilö ${name} numero ${phone} luetteloon`);
            mongoose.connection.close();
        });
} else if (process.argv.length === 2) {
    Folk
        .find({})
        .then(result => {
            result.forEach(folk => {
                console.log(folk);
            });
            mongoose.connection.close();
        });
} else {
    console.log('Usage: node mongo.js <name> <number> (add to phonebook) OR node mongo.js (print phonebook)');
    mongoose.connection.close();
}
