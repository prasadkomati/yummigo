// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components and Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import VendorDashboardLayout from './pages/vendor/VendorDashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import RestaurantList from './pages/customer/RestaurantList';
import RestaurantMenu from './pages/customer/RestaurantMenu'; // Add this import
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import Wishlist from './pages/customer/Wishlist';
import Profile from './pages/Profile';

// Vendor Pages
import Dashboard from './pages/vendor/Dashboard';
import RecipeList from './pages/vendor/RecipeList';
import AddRecipe from './pages/vendor/AddRecipe';
import VendorOrders from './pages/vendor/VendorOrders';
import RestaurantInfo from './pages/vendor/RestaurantInfo';
import VendorStats from './pages/vendor/VendorStats';

// Chat
import Chat from './pages/Chat';

// 404 Page
import NotFound from './pages/NotFound';

const App = () => (
  <>
    <Header />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RestaurantList />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurant/:id/menu" element={<RestaurantMenu />} /> {/* Add this route */}
      <Route path="/restaurant/:id" element={<RestaurantMenu />} /> {/* Alternative route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect old incorrect vendor paths */}
      <Route path="/dashboard" element={<Navigate to="/vendor/dashboard" replace />} />
      <Route path="/recipes" element={<Navigate to="/vendor/recipes" replace />} />
      <Route path="/vendor-orders" element={<Navigate to="/vendor/orders" replace />} />

      {/* Buyer Protected Routes */}
      <Route element={<ProtectedRoute roles={['buyer']} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

      {/* Vendor Protected Routes with VendorDashboardLayout */}
      <Route element={<ProtectedRoute roles={['vendor']} />}>
        <Route element={<VendorDashboardLayout />}>
          <Route path="/vendor/dashboard" element={<Dashboard />} />
          <Route path="/vendor/recipes" element={<RecipeList />} />
          <Route path="/vendor/add-recipe" element={<AddRecipe />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/restaurant" element={<RestaurantInfo />} />
          <Route path="/vendor/stats" element={<VendorStats />} />
          <Route path="/vendor/chat" element={<Chat />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </>
);

export default App;