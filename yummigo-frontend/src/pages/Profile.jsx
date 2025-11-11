// src/pages/Profile.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { auth, handleLogin, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (auth.user) {
            setFormData({
                name: auth.user.name,
                email: auth.user.email,
            });
        }
    }, [auth.user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put(`/api/users/${auth.user._id}`, formData);
            handleLogin(auth.token, res.data);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    const handleLogoutClick = () => {
        logout();
    };

    return (
        <Container className="my-4" style={{ maxWidth: '600px' }}>
            <h2>User Profile</h2>
            {message && <Alert>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="me-2">
                    Update Profile
                </Button>
                <Button variant="danger" onClick={handleLogoutClick}>
                    Logout
                </Button>
            </Form>
        </Container>
    );
};

export default Profile;
