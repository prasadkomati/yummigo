import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authMiddleware from './middleware/authMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS Configuration — adjust for frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Base route
app.get('/', (req, res) => {
  res.send('🍽️ YummiGo Backend is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Protected test route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted ✅', user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
