// src/pages/vendor/AddRecipe.js
import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { getCategories, addRecipe } from '../../services/recipeService';
import { AuthContext } from '../../context/AuthContext';

const AddRecipe = () => {
    const { auth } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        ingredients: '',
        available: true,
        category: '',
        image: '',
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch {
                setError('Failed to load categories');
            }
        };
        fetchCats();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const recipePayload = {
                ...formData,
                ingredients: formData.ingredients.split(',').map((ing) => ing.trim()),
                availability: formData.available,
                restaurant: auth.user.restaurantId,
            };
            await addRecipe(recipePayload);
            setMessage('Recipe added successfully');
            setFormData({
                name: '',
                description: '',
                price: '',
                ingredients: '',
                available: true,
                category: '',
                image: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add recipe');
        }
    };

    return (
        <>
            <h2>Add New Recipe</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Recipe Name</Form.Label>
                    <Form.Control required name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="ingredients">
                    <Form.Label>Ingredients (comma separated)</Form.Label>
                    <Form.Control
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="e.g. tomato, cheese, basil"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="available">
                    <Form.Check
                        type="checkbox"
                        label="Available"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select required name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="image">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control name="image" value={formData.image} onChange={handleChange} />
                </Form.Group>

                <Button type="submit" variant="primary">
                    Add Recipe
                </Button>
            </Form>
        </>
    );
};

export default AddRecipe;
