const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Buyer: Place order
exports.placeOrder = async (req, res) => {
    try {
        const { restaurant, items, totalPrice, address, paymentMethod } = req.body;

        // Validate required fields
        if (!restaurant || !items || items.length === 0 || !totalPrice || !address) {
            return res.status(400).json({ 
                message: 'All order fields are required: restaurant, items, totalPrice, address' 
            });
        }

        // Validate items structure
        for (let item of items) {
            if (!item.recipe || !item.quantity) {
                return res.status(400).json({ 
                    message: 'Each item must have recipe and quantity' 
                });
            }
        }

        const order = new Order({
            buyer: req.user._id,
            restaurant,
            items,
            totalPrice,
            address,
            paymentMethod: paymentMethod || 'COD',
        });

        await order.save();
        
        // Populate the order before sending response
        await order.populate('restaurant', 'name');
        await order.populate('items.recipe', 'name price');

        res.status(201).json({ 
            message: 'Order placed successfully', 
            order 
        });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Buyer: Get all my orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('restaurant', 'name')
            .populate('items.recipe', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Vendor: Get all orders for their restaurants
exports.getVendorOrders = async (req, res) => {
    try {
        // Find restaurants owned by this vendor
        const restaurants = await Restaurant.find({ vendor: req.user._id }).select('_id');
        
        if (restaurants.length === 0) {
            return res.json([]);
        }

        const restaurantIds = restaurants.map(r => r._id);
        
        const orders = await Order.find({ restaurant: { $in: restaurantIds } })
            .populate('buyer', 'name email')
            .populate('items.recipe', 'name price')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Get vendor orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Vendor: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the vendor owns this restaurant
        if (req.user.role === 'vendor') {
            const restaurant = await Restaurant.findById(order.restaurant);
            if (!restaurant || restaurant.vendor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }
        }

        if (status === 'Rejected' && !rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason required' });
        }

        order.status = status;
        if (status === 'Rejected') {
            order.rejectionReason = rejectionReason || '';
        }
        
        await order.save();

        // Populate before sending response
        await order.populate('restaurant', 'name');
        await order.populate('items.recipe', 'name price');

        res.json({ 
            message: 'Order status updated successfully', 
            order 
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID (Buyer tracking)
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id)
            .populate('restaurant', 'name')
            .populate('buyer', 'name email')
            .populate('items.recipe', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Buyer can only see their own orders
        if (req.user.role === 'buyer' && order.buyer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        // Vendor can only see their own restaurant orders
        if (req.user.role === 'vendor') {
            const restaurant = await Restaurant.findById(order.restaurant._id);
            if (!restaurant || restaurant.vendor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this order' });
            }
        }

        res.json(order);
    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Vendor: Analytics / Order stats
exports.getOrderStats = async (req, res) => {
    try {
        // Find restaurants owned by this vendor
        const restaurants = await Restaurant.find({ vendor: req.user._id }).select('_id');
        
        if (restaurants.length === 0) {
            return res.json({ 
                totalOrders: 0, 
                completedOrders: 0, 
                rejectedOrders: 0, 
                earnings: 0 
            });
        }

        const restaurantIds = restaurants.map(r => r._id);
        const orders = await Order.find({ restaurant: { $in: restaurantIds } });

        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'Delivered').length;
        const rejectedOrders = orders.filter(o => o.status === 'Rejected').length;
        const earnings = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, o) => sum + o.totalPrice, 0);

        res.json({ 
            totalOrders, 
            completedOrders, 
            rejectedOrders, 
            earnings 
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({ message: error.message });
    }
};