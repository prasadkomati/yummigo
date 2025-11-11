const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        timings: {
            type: String,
            required: true,
        },
        rating: { type: Number, default: 4 }, // ⭐ Default rating,
        image: {
            type: String,
            default: '', // URL or path
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
