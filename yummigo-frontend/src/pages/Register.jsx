// src/pages/Register.js
import React, { useContext, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { register, handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        vendorAgreementAccepted: false,
    });
    const [error, setError] = useState(null);

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.role === 'vendor' && !formData.vendorAgreementAccepted) {
            setError('You must accept the vendor agreement.');
            return;
        }

        try {
            const res = await register(formData);
            handleLogin(res.token, res.user);
            if (res.user.role === 'vendor') navigate('/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">🔐 Register – YummiGo</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Register as Vendor"
                        name="role"
                        checked={formData.role === 'vendor'}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                role: e.target.checked ? 'vendor' : 'buyer',
                            }))
                        }
                    />
                </Form.Group>

                {formData.role === 'vendor' && (
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="I accept the Vendor Agreement"
                            name="vendorAgreementAccepted"
                            checked={formData.vendorAgreementAccepted}
                            onChange={handleChange}
                        />
                    </Form.Group>
                )}

                <Button
                    variant="primary"
                    type="submit"
                    disabled={
                        !formData.name ||
                        !formData.email ||
                        !formData.password ||
                        !formData.confirmPassword ||
                        (formData.role === 'vendor' && !formData.vendorAgreementAccepted)
                    }
                    className="w-100"
                >
                    Register
                </Button>
            </Form>
        </Container>
    );
};

export default Register;
