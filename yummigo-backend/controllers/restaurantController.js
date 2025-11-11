const Restaurant = require('../models/Restaurant');

// Create a new restaurant (Only vendors allowed)
exports.createRestaurant = async (req, res) => {
    const { name, location, timings, image } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendors can add restaurants' });
    }

    try {
        const newRestaurant = new Restaurant({
            name,
            location,
            timings,
            image,
            vendor: req.user._id,  // changed from owner to vendor
        });

        await newRestaurant.save();
        return res.status(201).json(newRestaurant);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get all restaurants (Public)
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('vendor', 'name email'); // changed from owner to vendor
        return res.status(200).json(restaurants);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update a restaurant (Only vendor can update)
exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { name, location, timings, image } = req.body;

    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.vendor.toString() !== req.user._id.toString()) { // changed from owner to vendor
            return res.status(403).json({ message: 'Not authorized to update' });
        }

        restaurant.name = name || restaurant.name;
        restaurant.location = location || restaurant.location;
        restaurant.timings = timings || restaurant.timings;
        restaurant.image = image || restaurant.image;

        await restaurant.save();
        return res.status(200).json(restaurant);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Delete a restaurant (Only vendor can delete)
exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.vendor.toString() !== req.user._id.toString()) { // changed from owner to vendor
            return res.status(403).json({ message: 'Not authorized to delete' });
        }

        await restaurant.deleteOne();
        return res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
