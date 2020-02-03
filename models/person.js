const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI

console.log('connecting to: ', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB, error: ', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 8,
    required: true,
  },
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema); // store in collection 'persons or people' (1st param, lowercase plural!)
