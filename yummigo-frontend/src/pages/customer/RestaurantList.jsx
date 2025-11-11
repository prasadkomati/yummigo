// src/pages/customer/RestaurantList.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Extended restaurant data with diverse cuisines and high-quality images
    const demoRestaurants = [
        {
            id: '1',
            name: 'Italian Bistro',
            description: 'Authentic Italian cuisine with fresh ingredients and homemade pasta. Perfect for family dinners.',
            cuisine: 'Italian',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '30-45 min',
            rating: 4.5,
            price: '₹₹',
            timings: '11:00 AM - 10:00 PM'
        },
        {
            id: '2', 
            name: 'Spice Garden',
            description: 'Traditional Indian dishes with modern twist. Experience the rich flavors of India.',
            cuisine: 'Indian',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '25-40 min',
            rating: 4.3,
            price: '₹',
            timings: '10:00 AM - 11:00 PM'
        },
        {
            id: '3',
            name: 'Dragon Palace',
            description: 'Chinese favorites and sushi specialties. Fresh ingredients and authentic recipes.',
            cuisine: 'Chinese',
            image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '35-50 min',
            rating: 4.2,
            price: '₹₹',
            timings: '10:30 AM - 10:30 PM'
        },
        {
            id: '4',
            name: 'Burger Hub',
            description: 'Gourmet burgers, crispy fries, and delicious shakes. Perfect for quick bites.',
            cuisine: 'American',
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '20-35 min',
            rating: 4.6,
            price: '₹',
            timings: '9:00 AM - 11:00 PM'
        },
        {
            id: '5',
            name: 'Tokyo Sushi',
            description: 'Authentic Japanese sushi and sashimi. Master chefs preparing traditional dishes.',
            cuisine: 'Japanese',
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '40-55 min',
            rating: 4.7,
            price: '₹₹₹',
            timings: '11:30 AM - 10:00 PM'
        },
        {
            id: '6',
            name: 'Mediterranean Delight',
            description: 'Fresh Mediterranean cuisine with healthy options. Salads, wraps, and grilled specialties.',
            cuisine: 'Mediterranean',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            deliveryTime: '30-45 min',
            rating: 4.4,
            price: '₹₹',
            timings: '10:00 AM - 9:30 PM'
        },
       
       
        
    ];

    // Simple function to load restaurants - NO API CALLS
    const loadRestaurants = () => {
        setLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
            setRestaurants(demoRestaurants);
            setLoading(false);
            setError('');
        }, 1000);
    };

    useEffect(() => {
        loadRestaurants();
    }, []);

    if (loading) {
        return (
            <Container className="my-4">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="mt-3">Loading Amazing Restaurants...</h4>
                    <p className="text-muted">Finding the best food near you</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-dark">🍽️ Browse Restaurants</h1>
                <p className="lead text-muted">Discover delicious food from {demoRestaurants.length} top-rated restaurants</p>
            </div>

            {/* Demo Mode Alert */}
            {error && (
                <Alert variant="info" className="mb-4">
                    <strong>💡 Demo Mode:</strong> {error}
                </Alert>
            )}

            {/* Restaurants Grid */}
            <Row>
                {restaurants.map((restaurant) => (
                    <Col key={restaurant.id} xl={4} lg={6} className="mb-4">
                        <Card className="h-100 shadow-sm restaurant-card" style={{ transition: 'all 0.3s ease' }}>
                            {/* Restaurant Image */}
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={restaurant.image}
                                    style={{ 
                                        height: '200px', 
                                        objectFit: 'cover',
                                        width: '100%'
                                    }}
                                    onError={(e) => {
                                        // If image fails, show a colored placeholder
                                        e.target.style.display = 'none';
                                    }}
                                />
                                {/* Rating Badge */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ⭐ {restaurant.rating}
                                </div>
                            </div>

                            <Card.Body className="d-flex flex-column">
                                {/* Restaurant Name and Price */}
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Card.Title className="h5 mb-0" style={{ color: '#2c3e50' }}>
                                        {restaurant.name}
                                    </Card.Title>
                                    <span className="text-muted">{restaurant.price}</span>
                                </div>

                                {/* Cuisine Badge */}
                                <div className="mb-2">
                                    <span 
                                        className="badge"
                                        style={{ 
                                            backgroundColor: '#3498db', 
                                            color: 'white',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {restaurant.cuisine}
                                    </span>
                                </div>

                                {/* Description */}
                                <Card.Text 
                                    className="text-muted small flex-grow-1"
                                    style={{ lineHeight: '1.4' }}
                                >
                                    {restaurant.description}
                                </Card.Text>

                                {/* Delivery Info and Action Button */}
                                <div className="mt-auto">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="text-muted">
                                            <strong>🕒 {restaurant.deliveryTime}</strong>
                                        </small>
                                        <small className="text-muted">
                                            {restaurant.timings}
                                        </small>
                                    </div>
                                    
                                    <Button 
                                        as={Link} 
                                        to={`/restaurant/${restaurant.id}/menu`}
                                        variant="primary" 
                                        className="w-100 fw-bold"
                                        style={{ 
                                            backgroundColor: '#e74c3c', 
                                            borderColor: '#e74c3c',
                                            padding: '10px'
                                        }}
                                    >
                                        🍴 View Menu & Order
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Success Message when loaded */}
            {restaurants.length > 0 && (
                <div className="text-center mt-4">
                    <small className="text-success">
                        ✅ Showing {restaurants.length} amazing restaurants near you
                    </small>
                </div>
            )}

            {/* Refresh Button */}
            <div className="text-center mt-4">
                <Button variant="outline-primary" onClick={loadRestaurants}>
                    🔄 Refresh Restaurants
                </Button>
            </div>
        </Container>
    );
};

export default RestaurantList;