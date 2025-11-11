// src/pages/customer/Wishlist.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Wishlist = () => {
    const { auth } = useContext(AuthContext);
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!auth.token) return;
            try {
                const res = await API.get('/api/wishlist/my'); // Adjust endpoint if needed
                setWishlist(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchWishlist();
    }, [auth.token]);

    const handleRemove = async (id) => {
        try {
            await API.delete(`/api/wishlist/${id}`);
            setWishlist((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="my-4">
            <h2>My Wishlist</h2>
            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <Row>
                    {wishlist.map((item) => (
                        <Col key={item._id} md={4} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={item.recipe.image || 'https://via.placeholder.com/300x200'}
                                    alt={item.recipe.name}
                                />
                                <Card.Body>
                                    <Card.Title>{item.recipe.name}</Card.Title>
                                    <Card.Text>₹{item.recipe.price}</Card.Text>
                                    <Button variant="primary" onClick={() => addToCart(item.recipe)}>
                                        Add to Cart
                                    </Button>{' '}
                                    <Button variant="danger" onClick={() => handleRemove(item._id)}>
                                        Remove
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Wishlist;
