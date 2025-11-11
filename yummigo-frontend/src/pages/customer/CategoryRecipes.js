// src/pages/customer/CategoryRecipes.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getCategoryRecipes } from '../../services/recipeService';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CategoryRecipes = () => {
    const { categoryName } = useParams();
    const [recipes, setRecipes] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getCategoryRecipes(categoryName);
                setRecipes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecipes();
    }, [categoryName]);

    return (
        <Container className="my-4">
            <h2 className="mb-4 text-center">{categoryName} Recipes</h2>
            <Row>
                {recipes.length === 0 ? (
                    <p>No recipes found in this category</p>
                ) : (
                    recipes.map((recipe) => (
                        <Col key={recipe._id} md={4} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={recipe.image || 'https://via.placeholder.com/300x200'}
                                    alt={recipe.name}
                                />
                                <Card.Body>
                                    <Card.Title>{recipe.name}</Card.Title>
                                    <Card.Text>₹{recipe.price}</Card.Text>
                                    <Button
                                        variant="primary"
                                        disabled={!recipe.availability}
                                        onClick={() => addToCart(recipe)}
                                    >
                                        Add to Cart
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default CategoryRecipes;
