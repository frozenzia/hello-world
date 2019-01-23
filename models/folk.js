const mongoose = require('mongoose');
const Schema = mongoose.Schema;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true });

const folkSchema = new Schema({
    name: String,
    phone: String
});

folkSchema.statics.formatFolk = function(folk) {
    return ({
        id: folk._id,
        name: folk.name,
        phone: folk.phone
    });
};

const Folk = mongoose.model('Folk', folkSchema);

module.exports = Folk;
