// src/pages/vendor/RestaurantInfo.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const RestaurantInfo = () => {
    const { auth } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', address: '', phone: '', timings: '',
        image: '', cuisineType: '', deliveryTime: '', minOrderAmount: '', deliveryFee: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const cuisineTypes = [
        'Indian', 'Italian', 'Chinese', 'Mexican', 'American', 
        'Japanese', 'Thai', 'Mediterranean', 'Fast Food', 'Bakery',
        'Cafe', 'Barbecue', 'Seafood', 'Vegetarian', 'Vegan'
    ];

    const checkRestaurantProfile = () => {
        setLoading(true);
        setTimeout(() => {
            const existingRestaurant = localStorage.getItem(`restaurant_${auth.user?.id}`);
            if (existingRestaurant) {
                const restaurantData = JSON.parse(existingRestaurant);
                setRestaurant(restaurantData);
                setFormData({
                    name: restaurantData.name || '',
                    description: restaurantData.description || '',
                    address: restaurantData.address || '',
                    phone: restaurantData.phone || '',
                    timings: restaurantData.timings || '',
                    image: restaurantData.image || '',
                    cuisineType: restaurantData.cuisineType || '',
                    deliveryTime: restaurantData.deliveryTime || '',
                    minOrderAmount: restaurantData.minOrderAmount || '',
                    deliveryFee: restaurantData.deliveryFee || ''
                });
                setIsCreating(false);
            } else {
                setRestaurant(null);
                setIsCreating(true);
                setFormData({
                    name: '', description: '', address: '', phone: '',
                    timings: '9:00 AM - 10:00 PM', image: '', cuisineType: 'Indian',
                    deliveryTime: '30-45 min', minOrderAmount: '100', deliveryFee: '30'
                });
            }
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (auth.user) checkRestaurantProfile();
    }, [auth.user]);

    const onChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const createRestaurant = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setUpdating(true);
        try {
            if (!formData.name || !formData.address || !formData.phone) {
                throw new Error('Please fill in all required fields (Name, Address, Phone)');
            }
            const newRestaurant = {
                _id: 'rest_' + Date.now(),
                ...formData,
                vendorId: auth.user.id,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`restaurant_${auth.user.id}`, JSON.stringify(newRestaurant));
            auth.user.restaurantId = newRestaurant._id;
            setRestaurant(newRestaurant);
            setIsCreating(false);
            setMessage('🎉 Restaurant profile created successfully! You can now receive orders.');
        } catch (error) {
            setError(error.message || 'Failed to create restaurant profile. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const updateRestaurant = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setUpdating(true);
        try {
            if (!formData.name || !formData.address || !formData.phone) {
                throw new Error('Please fill in all required fields (Name, Address, Phone)');
            }
            const updatedRestaurant = {
                ...restaurant,
                ...formData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`restaurant_${auth.user.id}`, JSON.stringify(updatedRestaurant));
            setRestaurant(updatedRestaurant);
            setMessage('✅ Restaurant information updated successfully!');
        } catch (error) {
            setError(error.message || 'Failed to update restaurant information.');
        } finally {
            setUpdating(false);
        }
    };

    const onSubmit = isCreating ? createRestaurant : updateRestaurant;

    if (loading) {
        return (
            <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary" className="mb-3" />
                    <h4>Loading Restaurant Information...</h4>
                    <p className="text-muted">Please wait while we check your restaurant profile.</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Row>
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className={isCreating ? "bg-success text-white" : "bg-primary text-white"}>
                            <h3 className="mb-0">
                                {isCreating ? '🍽️ Create Restaurant Profile' : '🏪 Restaurant Information'}
                            </h3>
                            <small>
                                {isCreating ? 'Set up your restaurant to start receiving orders' : 'Manage your restaurant details and settings'}
                            </small>
                        </Card.Header>
                        <Card.Body>
                            {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
                            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                            {isCreating && (
                                <Alert variant="info" className="mb-4">
                                    <h5>Welcome! 👋</h5>
                                    <p className="mb-0">Create your restaurant profile to start receiving orders from customers.</p>
                                </Alert>
                            )}

                            <Form onSubmit={onSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Restaurant Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control required name="name" value={formData.name} onChange={onChange} placeholder="Enter your restaurant name" />
                                            <Form.Text className="text-muted">This will be displayed to customers</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                                            <Form.Control required name="phone" value={formData.phone} onChange={onChange} placeholder="Enter contact number" />
                                            <Form.Text className="text-muted">Customers will contact this number</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={onChange} placeholder="Describe your restaurant..." />
                                    <Form.Text className="text-muted">This description helps customers learn about your restaurant</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="textarea" rows={2} required name="address" value={formData.address} onChange={onChange} placeholder="Enter complete restaurant address" />
                                    <Form.Text className="text-muted">Full address where customers can find your restaurant</Form.Text>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="cuisineType">
                                            <Form.Label>Cuisine Type</Form.Label>
                                            <Form.Select name="cuisineType" value={formData.cuisineType} onChange={onChange}>
                                                {cuisineTypes.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="timings">
                                            <Form.Label>Operating Hours <span className="text-danger">*</span></Form.Label>
                                            <Form.Control required name="timings" value={formData.timings} onChange={onChange} placeholder="e.g., 9:00 AM - 10:00 PM" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="deliveryTime">
                                            <Form.Label>Delivery Time</Form.Label>
                                            <Form.Select name="deliveryTime" value={formData.deliveryTime} onChange={onChange}>
                                                <option value="15-25 min">15-25 minutes</option>
                                                <option value="20-30 min">20-30 minutes</option>
                                                <option value="25-35 min">25-35 minutes</option>
                                                <option value="30-45 min">30-45 minutes</option>
                                                <option value="45-60 min">45-60 minutes</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="minOrderAmount">
                                            <Form.Label>Minimum Order (₹)</Form.Label>
                                            <Form.Control type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={onChange} placeholder="0" min="0" />
                                            <Form.Text className="text-muted">Set 0 for no minimum</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="deliveryFee">
                                            <Form.Label>Delivery Fee (₹)</Form.Label>
                                            <Form.Control type="number" name="deliveryFee" value={formData.deliveryFee} onChange={onChange} placeholder="0" min="0" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4" controlId="image">
                                    <Form.Label>Restaurant Image URL</Form.Label>
                                    <Form.Control name="image" value={formData.image} onChange={onChange} placeholder="https://example.com/restaurant-image.jpg" />
                                    <Form.Text className="text-muted">Enter a direct link to your restaurant's main image (optional)</Form.Text>
                                </Form.Group>

                                {formData.image && (
                                    <div className="mb-4">
                                        <Form.Label>Image Preview</Form.Label>
                                        <div>
                                            <img src={formData.image} alt="Restaurant preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #dee2e6' }} onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant={isCreating ? "success" : "primary"} disabled={updating} className="px-4">
                                        {updating ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />{isCreating ? 'Creating...' : 'Updating...'}</> : isCreating ? '🚀 Create Restaurant Profile' : '💾 Update Restaurant Information'}
                                    </Button>
                                    {!isCreating && <Button variant="outline-secondary" onClick={checkRestaurantProfile} disabled={updating}>Refresh</Button>}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    {!isCreating && restaurant && (
                        <>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-light"><h5 className="mb-0">Restaurant Status</h5></Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span>Restaurant ID:</span><Badge bg="secondary">{restaurant._id}</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span>Status:</span><Badge bg={restaurant.isActive ? 'success' : 'warning'}>{restaurant.isActive ? 'Active' : 'Inactive'}</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Last Updated:</span><small className="text-muted">{restaurant.updatedAt ? new Date(restaurant.updatedAt).toLocaleDateString() : 'N/A'}</small>
                                    </div>
                                </Card.Body>
                            </Card>
                            
                            <Card className="shadow-sm mt-3">
                                <Card.Header className="bg-light"><h5 className="mb-0">Quick Actions</h5></Card.Header>
                                <Card.Body>
                                    <div className="d-grid gap-2">
                                        <Button variant="outline-primary" onClick={() => window.location.href = '/vendor/recipes'}>🍽️ Manage Recipes</Button>
                                        <Button variant="outline-success" onClick={() => window.location.href = '/vendor/orders'}>📋 View Orders</Button>
                                        <Button variant="outline-info" onClick={() => window.location.href = '/vendor/stats'}>📊 View Statistics</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </>
                    )}

                    <Card className="shadow-sm mt-3">
                        <Card.Header className="bg-light"><h5 className="mb-0">💡 Tips for Success</h5></Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled small">
                                <li className="mb-2">✅ Use high-quality food images</li>
                                <li className="mb-2">✅ Keep your menu updated regularly</li>
                                <li className="mb-2">✅ Set realistic delivery times</li>
                                <li className="mb-2">✅ Respond quickly to customer orders</li>
                                <li className="mb-2">✅ Monitor your restaurant reviews</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RestaurantInfo;