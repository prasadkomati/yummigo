import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Image, Badge, Alert, Button } from "react-bootstrap";
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      if (auth.token) {
        try {
          const response = await API.get('/api/orders/my');
          if (response.data && response.data.length > 0) {
            setOrders(response.data);
            return;
          }
        } catch (apiError) {
          console.log('API fetch failed, using local storage');
        }
      }
      
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(savedOrders);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', text: '⏳ Pending' },
      'confirmed': { variant: 'primary', text: '✅ Confirmed' },
      'preparing': { variant: 'info', text: '👨‍🍳 Preparing' },
      'out for delivery': { variant: 'info', text: '🚚 Out for Delivery' },
      'delivered': { variant: 'success', text: '🎉 Delivered' },
      'cancelled': { variant: 'danger', text: '❌ Cancelled' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || { variant: 'secondary', text: status || 'Pending' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <h4>Loading your orders...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <Button variant="outline-primary" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">
          <h5>No orders yet</h5>
          <p>You haven't placed any orders. Start shopping to see your orders here!</p>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || order.id}>
                <td>{order._id || order.id}</td>
                <td>
                  {order.items?.map((item, index) => (
                    <div key={index} className="mb-1">
                      <small>
                        {item.recipe?.name || item.name} × {item.quantity}
                        {item.recipe?.price && (
                          <span className="text-muted"> (₹{item.recipe.price})</span>
                        )}
                      </small>
                    </div>
                  ))}
                </td>
                <td>₹{order.totalPrice || order.total}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <small>{order.address || 'N/A'}</small>
                </td>
                <td>
                  <small>
                    {order.createdAt ? 
                      new Date(order.createdAt).toLocaleDateString() : 
                      (order.orderTime ? new Date(order.orderTime).toLocaleDateString() : 'N/A')
                    }
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;