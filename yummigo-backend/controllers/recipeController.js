const Recipe = require('../models/Recipe');
const Category = require('../models/Category');

// Get all recipes (Public) with optional pagination
exports.getAllRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalRecipes = await Recipe.countDocuments();

        const recipes = await Recipe.find()
            .populate('category', 'name')
            .populate({
                path: 'restaurant',
                select: 'name location vendor',
                populate: {
                    path: 'vendor',
                    select: 'name email',
                },
            })
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        res.json({
            page,
            limit,
            totalRecipes,
            totalPages: Math.ceil(totalRecipes / limit),
            recipes,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
    }
};

// Get single recipe by ID (Public)
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id)
            .populate('category', 'name')
            .populate({
                path: 'restaurant',
                select: 'name location vendor',
                populate: {
                    path: 'vendor',
                    select: 'name email',
                },
            });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Recipe (Vendor only)
exports.addRecipe = async (req, res) => {
    const { name, description, price, ingredients, availability, image, category, restaurant } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendors can add recipes' });
    }

    try {
        // Check if category exists, or create new
        let cat = await Category.findOne({ name: category });
        if (!cat) {
            cat = new Category({ name: category });
            await cat.save();
        }

        const recipe = new Recipe({
            name,
            description,
            price,
            ingredients,
            availability,
            image,
            restaurant,
            category: cat._id,
        });

        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Recipes by Restaurant (Public)
exports.getRestaurantRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ restaurant: req.params.restaurantId })
            .populate('category', 'name');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Recipe (Vendor only)
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Find recipe and populate restaurant.vendor
        const recipe = await Recipe.findById(id)
            .populate({
                path: 'restaurant',
                populate: { path: 'vendor', select: '_id name email' }
            });

        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (!recipe.restaurant || !recipe.restaurant.vendor) {
            return res.status(400).json({ message: 'Recipe missing restaurant or vendor information' });
        }

        // Only vendor who owns the restaurant can update
        if (recipe.restaurant.vendor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        Object.assign(recipe, updates);
        await recipe.save();

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Recipe (Vendor only)
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        // Find recipe and populate restaurant.vendor
        const recipe = await Recipe.findById(id)
            .populate({
                path: 'restaurant',
                populate: { path: 'vendor', select: '_id name email' }
            });

        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (!recipe.restaurant || !recipe.restaurant.vendor) {
            return res.status(400).json({ message: 'Recipe missing restaurant or vendor information' });
        }

        // Only vendor who owns the restaurant can delete
        if (recipe.restaurant.vendor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        await recipe.deleteOne();

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Recipes by Category (Public)
exports.getCategoryRecipes = async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.categoryName });
        if (!category) return res.json([]);

        const recipes = await Recipe.find({ category: category._id })
            .populate('restaurant', 'name location');

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Categories (Public)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
