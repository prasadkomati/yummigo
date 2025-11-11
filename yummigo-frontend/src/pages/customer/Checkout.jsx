import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'; // Add this import
const Checkout = () => {
    const { cartItems, totalPrice, clearCart, getRestaurantId } = useCart();
    const { auth } = useContext(AuthContext);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!address) {
            setError('Please enter a delivery address');
            return;
        }

        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        const restaurantId = getRestaurantId();
        if (!restaurantId) {
            setError('Cannot determine restaurant. Please try again.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const orderData = {
                restaurant: restaurantId,
                items: cartItems.map((item) => ({
                    recipe: item.recipe._id,
                    quantity: item.quantity,
                })),
                totalPrice: totalPrice,
                address: address,
                paymentMethod: 'COD',
            };

            console.log('Sending order data:', orderData);

            const response = await API.post('/api/orders', orderData);
            
            if (response.data) {
                setMessage('Order placed successfully!');
                clearCart();
                
                // Save order to localStorage for order history
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                const newOrder = {
                    id: response.data.order?._id || 'ORD_' + Date.now(),
                    ...response.data.order,
                    orderTime: new Date().toISOString(),
                    status: 'pending'
                };
                localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
                
                setTimeout(() => {
                    navigate('/orders');
                }, 2000);
            }
        } catch (error) {
            console.error('Order error:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to place order. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <h2>Checkout</h2>
            
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5>Order Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            {cartItems.map((item) => (
                                <div key={item.recipe._id} className="d-flex justify-content-between mb-2">
                                    <span>
                                        {item.recipe.name} × {item.quantity}
                                    </span>
                                    <span>₹{item.recipe.price * item.quantity}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </Card.Body>
                    </Card>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Delivery Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your complete delivery address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control
                                type="text"
                                value="Cash on Delivery (COD)"
                                readOnly
                                disabled
                            />
                            <Form.Text className="text-muted">
                                Currently we only accept Cash on Delivery
                            </Form.Text>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            onClick={handlePlaceOrder} 
                            disabled={loading || cartItems.length === 0}
                            className="w-100 py-2"
                        >
                            {loading ? 'Placing Order...' : `Place Order - ₹${totalPrice}`}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;