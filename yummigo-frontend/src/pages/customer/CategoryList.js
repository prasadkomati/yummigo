// src/pages/customer/CategoryList.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCategories } from '../../services/recipeService';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Recipe Categories</h2>
            <Row>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <Col key={category._id} md={3} className="mb-4">
                            <Card
                                className="shadow-sm cursor-pointer"
                                onClick={() => navigate(`/categories/${category.name}`)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={category.image || 'https://via.placeholder.com/200x150'}
                                    alt={category.name}
                                />
                                <Card.Body>
                                    <Card.Title className="text-center">{category.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No categories found</p>
                )}
            </Row>
        </Container>
    );
};

export default CategoryList;
