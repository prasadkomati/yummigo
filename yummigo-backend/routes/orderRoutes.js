// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const Recipe = require('../models/Recipe');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ CREATE new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurant, items, totalPrice, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Validate items
    for (const item of items) {
      const recipe = await Recipe.findById(item.recipe);
      if (!recipe) {
        return res.status(400).json({
          success: false,
          message: `Recipe not found: ${item.recipe}`
        });
      }
      if (!recipe.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Recipe not available: ${recipe.name}`
        });
      }
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    const order = new Order({
      orderNumber,
      customer: req.user.id,
      restaurant,
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      status: 'pending'
    });

    await order.save();
    
    // Populate the order with recipe and restaurant details
    await order.populate([
      { path: 'items.recipe', select: 'name price image' },
      { path: 'restaurant', select: 'name cuisine' },
      { path: 'customer', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// ✅ GET vendor orders
router.get('/vendor/my-orders', authMiddleware, async (req, res) => {
  try {
    // Find restaurant owned by vendor
    const restaurant = await Restaurant.findOne({ vendor: req.user.id });
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found for this vendor'
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('customer', 'name email phone')
      .populate('items.recipe', 'name price image category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// ✅ GET customer orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('restaurant', 'name cuisine image')
      .populate('items.recipe', 'name price image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// ✅ UPDATE order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email phone')
     .populate('items.recipe', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router;