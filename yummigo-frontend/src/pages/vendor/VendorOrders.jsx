// src/pages/vendor/VendorOrders.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Form, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const VendorOrders = () => {
    const { auth } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [statusUpdates, setStatusUpdates] = useState({});

    // Demo orders data for development
    const demoOrders = [
        {
            _id: '1',
            orderNumber: 'ORD-001',
            buyer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210'
            },
            items: [
                {
                    recipe: {
                        name: 'Margherita Pizza',
                        price: 399
                    },
                    quantity: 2
                },
                {
                    recipe: {
                        name: 'Garlic Bread',
                        price: 129
                    },
                    quantity: 1
                }
            ],
            totalPrice: 927,
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z',
            deliveryAddress: '123 Main St, Mumbai, Maharashtra 400001'
        },
        {
            _id: '2',
            orderNumber: 'ORD-002',
            buyer: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+91 9876543211'
            },
            items: [
                {
                    recipe: {
                        name: 'Pasta Carbonara',
                        price: 349
                    },
                    quantity: 1
                },
                {
                    recipe: {
                        name: 'Tiramisu',
                        price: 199
                    },
                    quantity: 2
                }
            ],
            totalPrice: 747,
            status: 'confirmed',
            createdAt: '2024-01-15T11:15:00Z',
            deliveryAddress: '456 Oak Avenue, Delhi 110001'
        },
        {
            _id: '3',
            orderNumber: 'ORD-003',
            buyer: {
                name: 'Mike Johnson',
                email: 'mike@example.com',
                phone: '+91 9876543212'
            },
            items: [
                {
                    recipe: {
                        name: 'Margherita Pizza',
                        price: 399
                    },
                    quantity: 1
                },
                {
                    recipe: {
                        name: 'Garlic Bread',
                        price: 129
                    },
                    quantity: 2
                },
                {
                    recipe: {
                        name: 'Pasta Carbonara',
                        price: 349
                    },
                    quantity: 1
                }
            ],
            totalPrice: 1206,
            status: 'preparing',
            createdAt: '2024-01-15T12:00:00Z',
            deliveryAddress: '789 Pine Road, Bangalore 560001'
        },
        {
            _id: '4',
            orderNumber: 'ORD-004',
            buyer: {
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                phone: '+91 9876543213'
            },
            items: [
                {
                    recipe: {
                        name: 'Tiramisu',
                        price: 199
                    },
                    quantity: 3
                }
            ],
            totalPrice: 597,
            status: 'out for delivery',
            createdAt: '2024-01-15T09:45:00Z',
            deliveryAddress: '321 Elm Street, Chennai 600001'
        },
        {
            _id: '5',
            orderNumber: 'ORD-005',
            buyer: {
                name: 'David Brown',
                email: 'david@example.com',
                phone: '+91 9876543214'
            },
            items: [
                {
                    recipe: {
                        name: 'Margherita Pizza',
                        price: 399
                    },
                    quantity: 1
                },
                {
                    recipe: {
                        name: 'Pasta Carbonara',
                        price: 349
                    },
                    quantity: 1
                }
            ],
            totalPrice: 748,
            status: 'delivered',
            createdAt: '2024-01-14T18:30:00Z',
            deliveryAddress: '654 Maple Lane, Kolkata 700001'
        }
    ];

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Check if user has restaurant ID
            if (!auth.user?.restaurantId) {
                console.log('No restaurant ID found, using demo data');
                // Use demo data for development
                setOrders(demoOrders);
                setError('Demo Mode: Using sample orders. Complete your restaurant profile to see real orders.');
                return;
            }

            // If restaurant ID exists, try to fetch from API
            try {
                // Simulate API call - replace with actual API call
                console.log('Fetching orders for restaurant:', auth.user.restaurantId);
                
                // For now, use demo data even if restaurant ID exists
                // Replace this with actual API call:
                // const response = await API.get(`/api/orders/vendor/${auth.user.restaurantId}`);
                // setOrders(response.data);
                
                setOrders(demoOrders);
                setMessage('Orders loaded successfully');
                
            } catch (apiError) {
                console.error('API Error:', apiError);
                // Fallback to demo data if API fails
                setOrders(demoOrders);
                setError('API connection failed. Showing demo orders.');
            }
            
        } catch (err) {
            console.error('Error in fetchOrders:', err);
            setError('Failed to load orders. Using demo data for demonstration.');
            setOrders(demoOrders);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [auth.user]);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
    };

    const updateOrderStatus = async (orderId) => {
        try {
            setMessage('');
            const newStatus = statusUpdates[orderId];
            
            if (!newStatus) {
                setError('Please select a status');
                return;
            }

            // Simulate API call to update status
            console.log(`Updating order ${orderId} to status: ${newStatus}`);
            
            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            setStatusUpdates(prev => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });

            setMessage(`Order ${orderId} status updated to ${newStatus}`);
            
            // In real app, you would call:
            // await API.put(`/api/orders/${orderId}/status`, { status: newStatus });
            
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update order status');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: 'secondary', text: '⏳ Pending' },
            confirmed: { variant: 'primary', text: '✅ Confirmed' },
            preparing: { variant: 'warning', text: '👨‍🍳 Preparing' },
            'out for delivery': { variant: 'info', text: '🚚 Out for Delivery' },
            delivered: { variant: 'success', text: '🎉 Delivered' },
            cancelled: { variant: 'danger', text: '❌ Cancelled' }
        };

        const config = statusConfig[status] || { variant: 'dark', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const getTotalOrdersStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(order => order.status === 'pending').length,
            confirmed: orders.filter(order => order.status === 'confirmed').length,
            preparing: orders.filter(order => order.status === 'preparing').length,
            delivered: orders.filter(order => order.status === 'delivered').length,
            revenue: orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + order.totalPrice, 0)
        };
        return stats;
    };

    const stats = getTotalOrdersStats();

    if (loading) {
        return (
            <Container className="my-4">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <h4 className="mt-3">Loading Orders...</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Manage Orders</h2>
                    <p className="text-muted">Track and manage customer orders</p>
                </div>
                <Button variant="outline-primary" onClick={fetchOrders}>
                    🔄 Refresh
                </Button>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="info">{error}</Alert>}

            {/* Orders Statistics */}
            <Row className="mb-4">
                <Col xl={2} lg={4} md={6} className="mb-3">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="text-primary">{stats.total}</Card.Title>
                            <Card.Text>Total Orders</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={2} lg={4} md={6} className="mb-3">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="text-warning">{stats.pending}</Card.Title>
                            <Card.Text>Pending</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={2} lg={4} md={6} className="mb-3">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="text-info">{stats.preparing}</Card.Title>
                            <Card.Text>Preparing</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={2} lg={4} md={6} className="mb-3">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title className="text-success">{stats.delivered}</Card.Title>
                            <Card.Text>Delivered</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4} lg={8} className="mb-3">
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title className="text-success">{formatPrice(stats.revenue)}</Card.Title>
                            <Card.Text>Total Revenue</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {orders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="display-1 text-muted">📦</div>
                    <h4 className="mt-3">No Orders Found</h4>
                    <p className="text-muted mb-4">
                        {auth.user?.restaurantId 
                            ? "You don't have any orders yet. Orders will appear here when customers place them."
                            : "Complete your restaurant profile to start receiving orders."
                        }
                    </p>
                    {!auth.user?.restaurantId && (
                        <Button 
                            variant="primary" 
                            onClick={() => window.location.href = '/vendor/restaurant'}
                        >
                            Complete Restaurant Profile
                        </Button>
                    )}
                </div>
            ) : (
                <Row>
                    {orders.map((order) => (
                        <Col key={order._id} lg={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{order.orderNumber}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {formatDate(order.createdAt)}
                                        </small>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </Card.Header>
                                <Card.Body>
                                    {/* Customer Info */}
                                    <div className="mb-3">
                                        <h6 className="mb-2">👤 Customer Details</h6>
                                        <p className="mb-1"><strong>{order.buyer.name}</strong></p>
                                        <p className="mb-1 small text-muted">{order.buyer.email}</p>
                                        <p className="mb-0 small text-muted">{order.buyer.phone}</p>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="mb-3">
                                        <h6 className="mb-2">📍 Delivery Address</h6>
                                        <p className="small text-muted mb-0">{order.deliveryAddress}</p>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-3">
                                        <h6 className="mb-2">🍽️ Order Items</h6>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">
                                                    {item.recipe.name} × {item.quantity}
                                                </span>
                                                <span className="small text-muted">
                                                    {formatPrice(item.recipe.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <strong>Total:</strong>
                                            <strong className="text-primary">{formatPrice(order.totalPrice)}</strong>
                                        </div>
                                    </div>

                                    {/* Status Update */}
                                    <div>
                                        <Form.Group>
                                            <Form.Label><small>Update Status:</small></Form.Label>
                                            <div className="d-flex gap-2">
                                                <Form.Select
                                                    size="sm"
                                                    value={statusUpdates[order._id] || order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="confirmed">✅ Confirmed</option>
                                                    <option value="preparing">👨‍🍳 Preparing</option>
                                                    <option value="out for delivery">🚚 Out for Delivery</option>
                                                    <option value="delivered">🎉 Delivered</option>
                                                    <option value="cancelled">❌ Cancelled</option>
                                                </Form.Select>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => updateOrderStatus(order._id)}
                                                    disabled={!statusUpdates[order._id] || statusUpdates[order._id] === order.status}
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Demo Mode Info */}
            {process.env.NODE_ENV === 'development' && (
                <Alert variant="light" className="mt-4">
                    <h6>🛠️ Development Mode</h6>
                    <p className="mb-2">Showing demo orders. In production, this will connect to your backend API.</p>
                    <small className="text-muted">
                        Restaurant ID: {auth.user?.restaurantId || 'Not set'}
                    </small>
                </Alert>
            )}
        </Container>
    );
};

export default VendorOrders;