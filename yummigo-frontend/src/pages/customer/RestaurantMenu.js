// src/pages/customer/RestaurantMenu.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap'; 


const API_BASE_URL = "http://localhost:5000/api"; // ⚠️ Change to your deployed backend URL if needed

const RestaurantMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    // Demo restaurant data
    const demoRestaurants = {
        '1': {
            id: '1',
            name: 'Italian Bistro',
            description: 'Authentic Italian cuisine with fresh ingredients',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop',
            rating: 4.5,
            deliveryTime: '30-45 min',
            cuisine: 'Italian'
        },
        '2': {
            id: '2',
            name: 'Spice Garden',
            description: 'Traditional Indian dishes with modern twist',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=300&fit=crop',
            rating: 4.3,
            deliveryTime: '25-40 min',
            cuisine: 'Indian'
        },
        '3': {
            id: '3',
            name: 'Dragon Palace',
            description: 'Chinese favorites and sushi specialties',
            image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=300&fit=crop',
            rating: 4.2,
            deliveryTime: '35-50 min',
            cuisine: 'Chinese'
        }
    };

    // Demo menu data for each restaurant
    const demoMenus = {
        '1': [
            { id: 1, name: 'Margherita Pizza', description: 'Fresh tomato sauce, mozzarella, basil', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=150&fit=crop' },
            { id: 2, name: 'Pasta Carbonara', description: 'Spaghetti with creamy sauce, pancetta', price: 349, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200&h=150&fit=crop' },
            { id: 3, name: 'Tiramisu', description: 'Classic Italian dessert with coffee', price: 199, category: 'Dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=150&fit=crop' },
            { id: 4, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 129, category: 'Appetizer', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=200&h=150&fit=crop' }
        ]
        
    };
   
    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            const restaurantData = demoRestaurants[id] || demoRestaurants['1'];
            const menuData = demoMenus[id] || demoMenus['1'];
            
            setRestaurant(restaurantData);
            setMenu(menuData);
            setLoading(false);
        }, 1000);
    }, [id]);

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === itemId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevCart.filter(item => item.id !== itemId);
            }
        });
    };

    const getItemQuantity = (itemId) => {
        const cartItem = cart.find(item => item.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const getTotalCartItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items to proceed.');
            return;
        }
        setShowCheckoutModal(true);
    };

    const processPayment = () => {
        setTimeout(() => {
            const order = {
                id: 'ORD' + Date.now(),
                restaurant: restaurant,
                items: cart,
                total: getTotalPrice(),
                paymentMethod: paymentMethod,
                status: 'confirmed',
                orderTime: new Date().toLocaleString(),
                estimatedDelivery: '30-45 minutes'
            };

            setOrderDetails(order);
            setOrderSuccess(true);
            setShowCheckoutModal(false);
            setCart([]);

            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));
        }, 2000);
    };

    const clearCart = () => setCart([]);

    const continueShopping = () => {
        setOrderSuccess(false);
        setOrderDetails(null);
    };

    if (loading) {
        return (
            <Container className="my-4">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <h4 className="mt-3">Loading Menu...</h4>
                </div>
            </Container>
        );
    }

    if (!restaurant) {
        return (
            <Container className="my-4">
                <Alert variant="danger">
                    <h4>Restaurant Not Found</h4>
                    <p>The restaurant you're looking for doesn't exist.</p>
                </Alert>
            </Container>
        );
    }

    const menuByCategory = menu.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <Container className="my-4">
            {orderSuccess && orderDetails && (
                <Alert variant="success" className="mb-4">
                    <div className="text-center">
                        <h4>🎉 Order Placed Successfully!</h4>
                        <p className="mb-2"><strong>Order ID:</strong> {orderDetails.id}</p>
                        <p className="mb-2"><strong>Total Amount:</strong> ₹{orderDetails.total}</p>
                        <p className="mb-2"><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
                        <p className="mb-2"><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</p>
                        <p className="mb-3"><strong>Status:</strong> <Badge bg="success">{orderDetails.status}</Badge></p>
                        <div className="d-flex justify-content-center gap-2">
                            <Button variant="primary" onClick={continueShopping}>
                                Continue Shopping
                            </Button>
                            <Button variant="outline-primary" onClick={() => navigate('/orders')}>
                                View Orders
                            </Button>
                        </div>
                    </div>
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={8}>
                    <div className="d-flex align-items-center mb-3">
                        <h1 className="mb-0">{restaurant.name}</h1>
                        <Badge bg="success" className="ms-3 fs-6">⭐ {restaurant.rating}</Badge>
                    </div>
                    <p className="text-muted lead">{restaurant.description}</p>
                    <div className="d-flex gap-4 text-muted">
                        <span>🍽️ {restaurant.cuisine}</span>
                        <span>🕒 {restaurant.deliveryTime}</span>
                    </div>
                </Col>
                <Col md={4}>
                    <img src={restaurant.image} alt={restaurant.name} className="img-fluid rounded shadow" style={{ height: '150px', width: '100%', objectFit: 'cover' }} />
                </Col>
            </Row>

            {cart.length > 0 && !orderSuccess && (
                <Alert variant="info" className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>🛒 Cart: {getTotalCartItems()} items</strong>
                            <span className="ms-2">Total: ₹{getTotalPrice()}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-danger" size="sm" onClick={clearCart}>Clear Cart</Button>
                            <Button variant="primary" size="sm" onClick={handleCheckout}>Proceed to Checkout ({getTotalCartItems()})</Button>
                        </div>
                    </div>
                    <div className="mt-2">
                        {cart.map(item => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center small">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </Alert>
            )}

            {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category} className="mb-5">
                    <h3 className="border-bottom pb-2 mb-3">{category}</h3>
                    <Row>
                        {items.map((item) => {
                            const quantity = getItemQuantity(item.id);
                            return (
                                <Col key={item.id} lg={6} className="mb-3">
                                    <Card className="h-100">
                                        <Row className="g-0">
                                            <Col md={4}>
                                                <img src={item.image} alt={item.name} className="img-fluid h-100" style={{ objectFit: 'cover', minHeight: '120px' }} />
                                            </Col>
                                            <Col md={8}>
                                                <Card.Body className="d-flex flex-column h-100">
                                                    <div className="flex-grow-1">
                                                        <Card.Title className="h6 mb-1">{item.name}</Card.Title>
                                                        <Card.Text className="text-muted small mb-2">{item.description}</Card.Text>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                                        <span className="fw-bold text-primary">₹{item.price}</span>
                                                        {quantity > 0 ? (
                                                            <div className="d-flex align-items-center">
                                                                <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)} style={{ width: '30px', height: '30px', padding: 0 }}>-</Button>
                                                                <span className="mx-2 fw-bold">{quantity}</span>
                                                                <Button variant="outline-success" size="sm" onClick={() => addToCart(item)} style={{ width: '30px', height: '30px', padding: 0 }}>+</Button>
                                                            </div>
                                                        ) : (
                                                            <Button variant="primary" size="sm" onClick={() => addToCart(item)}>Add to Cart</Button>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            ))}

            {menu.length === 0 && (
                <div className="text-center py-5">
                    <h4>No Menu Items Available</h4>
                    <p className="text-muted">This restaurant hasn't added any items to their menu yet.</p>
                </div>
            )}

            <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <h6>Order Summary</h6>
                        {cart.map(item => (
                            <div key={item.id} className="d-flex justify-content-between small mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>₹{getTotalPrice()}</span>
                        </div>
                    </div>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Select Payment Method</strong></Form.Label>
                            <div>
                                <Form.Check type="radio" label="💵 Cash on Delivery" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="mb-2" />
                                <Form.Check type="radio" label="💳 Credit/Debit Card" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            </div>
                        </Form.Group>

                        {paymentMethod === 'card' && (
                            <div className="border p-3 rounded bg-light">
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control type="text" placeholder="1234 5678 9012 3456" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Expiry Date</Form.Label>
                                            <Form.Control type="text" placeholder="MM/YY" />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control type="text" placeholder="123" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cardholder Name</Form.Label>
                                    <Form.Control type="text" placeholder="John Doe" />
                                </Form.Group>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={processPayment}>
                        {paymentMethod === 'cash' ? 'Place Order (Cash on Delivery)' : 'Pay Now'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {cart.length > 0 && !orderSuccess && (
                <div className="d-block d-md-none fixed-bottom bg-white border-top p-3 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{getTotalCartItems()} items</strong>
                            <span className="ms-2">₹{getTotalPrice()}</span>
                        </div>
                        <Button variant="primary" onClick={handleCheckout}>Checkout</Button>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default RestaurantMenu;
