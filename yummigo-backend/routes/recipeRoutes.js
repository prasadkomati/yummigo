const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add this to your recipes.js routes
// ✅ GET recipes by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      vendor: req.params.restaurantId, // This should be the restaurant's vendor ID
      isAvailable: true 
    }).select('name description price category image ingredients preparationTime isAvailable');

    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    console.error('Error fetching restaurant recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant recipes',
      error: error.message
    });
  }
});
// ✅ GET all recipes for the logged-in vendor
router.get('/my-recipes', authMiddleware, async (req, res) => {
  try {
    console.log('📥 GET /api/recipes/my-recipes - User:', req.user.id);
    
    const recipes = await Recipe.find({ vendor: req.user.id });
    
    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    console.error('❌ Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
});

// ✅ GET all recipes (public)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isAvailable: true }).populate('vendor', 'name');
    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
});

// ✅ CREATE new recipe
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('📥 POST /api/recipes - Creating recipe:', req.body);
    
    const { name, description, price, category, image, ingredients, preparationTime, isAvailable } = req.body;

    // Create new recipe
    const recipe = new Recipe({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      ingredients: ingredients ? ingredients.split(',').map(item => item.trim()) : [],
      preparationTime: preparationTime || '30 min',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      vendor: req.user.id
    });

    await recipe.save();
    
    res.status(201).json({
      success: true,
      message: 'Recipe created successfully!',
      recipe: recipe
    });
  } catch (error) {
    console.error('❌ Error creating recipe:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating recipe',
      error: error.message
    });
  }
});

// ✅ UPDATE recipe
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : recipe.price,
        ingredients: req.body.ingredients ? 
          req.body.ingredients.split(',').map(item => item.trim()) : 
          recipe.ingredients
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Recipe updated successfully!',
      recipe: updatedRecipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating recipe',
      error: error.message
    });
  }
});

// ✅ DELETE recipe
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Recipe deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message
    });
  }
});

// ✅ TOGGLE recipe availability
router.put('/:id/availability', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isAvailable: !recipe.isAvailable },
      { new: true }
    );

    res.json({
      success: true,
      message: `Recipe ${updatedRecipe.isAvailable ? 'enabled' : 'disabled'} successfully!`,
      recipe: updatedRecipe
    });
  } catch (error) {
    console.error('Error toggling recipe availability:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating recipe availability',
      error: error.message
    });
  }
});

module.exports = router;