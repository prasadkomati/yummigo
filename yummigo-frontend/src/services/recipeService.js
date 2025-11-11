// src/services/recipeService.js
import api from './api'; // Make sure you have this API configuration

// Add the missing functions
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const addRecipe = async (recipeData) => {
    try {
        const response = await api.post('/recipes', recipeData);
        return response.data;
    } catch (error) {
        console.error('Error adding recipe:', error);
        throw error;
    }
};

// Keep your existing functions
export const getRestaurantRecipes = async (restaurantId) => {
    try {
        const response = await api.get(`/recipes/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurant recipes:', error);
        throw error;
    }
};

export const updateRecipe = async (recipeId, recipeData) => {
    try {
        const response = await api.put(`/recipes/${recipeId}`, recipeData);
        return response.data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

export const deleteRecipe = async (recipeId) => {
    try {
        const response = await api.delete(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};