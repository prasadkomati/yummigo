// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { getRestaurants } from '../services/restaurantService';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants();
                setRestaurants(data);
            } catch (err) {
                setError('Failed to load restaurants');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">🍽️ Browse Restaurants</h2>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && restaurants.length === 0 && !error && (
                <p className="text-center">No restaurants found.</p>
            )}

            <Row>
                {restaurants.map((restaurant) => (
                    <Col key={restaurant._id || restaurant.id} md={4} sm={6} xs={12} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Img
                                variant="top"
                                src={restaurant.image || 'https://via.placeholder.com/300x200'}
                                alt={restaurant.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{restaurant.name}</Card.Title>
                                <Card.Text>
                                    {restaurant.location}
                                </Card.Text>
                                {/* Uncomment to show more info if available:
                <Card.Text>{restaurant.description}</Card.Text>
                <Card.Text>Rating: {restaurant.rating}</Card.Text>
                */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
