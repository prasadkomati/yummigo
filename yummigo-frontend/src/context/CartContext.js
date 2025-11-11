// src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case CART_ACTIONS.LOAD_CART:
      return { 
        ...state, 
        cartItems: action.payload, 
        loading: false 
      };

    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.cartItems.find(
        item => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
        };
      }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cartItems: []
      };

    default:
      return state;
  }
};

const initialState = {
  cartItems: [],
  loading: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    const cartItem = {
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      restaurant: item.restaurant,
      category: item.category,
      quantity: 1
    };
    
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { itemId, quantity } 
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Calculate total price
  const totalPrice = state.cartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );

  // Get cart item count
  const cartItemCount = state.cartItems.reduce(
    (total, item) => total + item.quantity, 
    0
  );

  const value = {
    cartItems: state.cartItems,
    totalPrice,
    cartItemCount,
    loading: state.loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};