const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        default: '', // Optional: image for category card
    },
});

module.exports = mongoose.model('Category', categorySchema);
