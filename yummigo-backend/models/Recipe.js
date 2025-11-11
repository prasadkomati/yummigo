const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
      'Salads', 'Soups', 'Breads', 'Rice & Noodles', 
      'Seafood', 'Vegetarian', 'Non-Vegetarian', 'Specials'
    ]
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Recipe+Image'
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: String,
    default: '30 min'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false // Optional for now
  }
}, {
  timestamps: true
});

// Index for better performance
recipeSchema.index({ vendor: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ isAvailable: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;