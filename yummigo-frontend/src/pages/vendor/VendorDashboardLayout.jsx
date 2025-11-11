import React, { useContext } from 'react';
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './VendorDashboardLayout.css'; // Keep this if you have CSS; else remove this line.

const VendorDashboardLayout = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="sidebar bg-light vh-100 p-3">
                    <h3 className="mb-4 text-center">YummiGo Vendor</h3>
                    <Nav className="flex-column">
                        <Nav.Link as={NavLink} to="/vendor/dashboard" end>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/vendor/recipes">
                            Manage Recipes
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/vendor/orders">
                            Manage Orders
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/vendor/restaurant">
                            Restaurant Info
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/vendor/stats">
                            Stats
                        </Nav.Link>
                    </Nav>
                </Col>

                <Col md={10} className="vh-100 d-flex flex-column">
                    <Navbar bg="light" expand="lg" className="shadow-sm px-3">
                        <Navbar.Toggle aria-controls="vendor-navbar-nav" />
                        <Navbar.Collapse id="vendor-navbar-nav" className="justify-content-end">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="secondary" id="dropdown-profile">
                                    {auth.user?.name || 'Vendor'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>
                    </Navbar>

                    <main className="p-4 overflow-auto flex-grow-1">
                        <Outlet />
                    </main>
                </Col>
            </Row>
        </Container>
    );
};

export default VendorDashboardLayout;
