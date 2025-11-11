// src/services/restaurantService.js
import API from './api';

// Get all restaurants
export const getRestaurants = async () => {
    const res = await API.get('/api/restaurants');
    return res.data;
};

// Get details of a single restaurant by ID
export const getRestaurantById = async (restaurantId) => {
    const res = await API.get(`/api/restaurants/${restaurantId}`);
    return res.data;
};

// Add a new restaurant (for vendor/admin)
export const addRestaurant = async (restaurantData) => {
    const res = await API.post('/api/restaurants', restaurantData);
    return res.data;
};

// Update restaurant details
export const updateRestaurant = async (restaurantId, updateData) => {
    const res = await API.put(`/api/restaurants/${restaurantId}`, updateData);
    return res.data;
};

// Delete a restaurant
export const deleteRestaurant = async (restaurantId) => {
    const res = await API.delete(`/api/restaurants/${restaurantId}`);
    return res.data;
};
