// src/components/Header.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-3 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    YummiGo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar" />
                <Navbar.Collapse id="basic-navbar">
                    <Nav className="ms-auto">
                        {!auth.user ? (
                            <>
                                <Nav.Link as={NavLink} to="/login">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/register">
                                    Register
                                </Nav.Link>
                            </>
                        ) : auth.user.role === 'buyer' ? (
                            <>
                                <Nav.Link as={NavLink} to="/">
                                    Home
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/cart">
                                    Cart
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/orders">
                                    Orders
                                </Nav.Link>
                                <Button className="ms-2" variant="outline-danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/dashboard">
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/recipes">
                                    Manage Recipes
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/vendor-orders">
                                    Orders
                                </Nav.Link>
                                <Button className="ms-2" variant="outline-danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
