const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurantController');

// Public: Get all restaurants
router.get('/', getRestaurants);

// Protected: Only vendor can add/update/delete their own restaurants
router.post('/', authMiddleware, createRestaurant);
router.put('/:id', authMiddleware, updateRestaurant);
router.delete('/:id', authMiddleware, deleteRestaurant);

module.exports = router;
