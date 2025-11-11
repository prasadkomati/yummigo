import React from 'react';
import { Container, Table, Button, Form, Alert, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate delivery fee and total
  const deliveryFee = totalPrice > 200 ? 0 : 40;
  const tax = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryFee + tax;

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="mt-3">Loading your cart...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Cart 🛒</h2>
        {cartItems.length > 0 && (
          <Badge bg="primary" className="fs-6">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </Badge>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="display-1 mb-3">🛒</div>
            <h4>Your cart is empty</h4>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/restaurants')}
              size="lg"
            >
              Browse Restaurants
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id || item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image || item.recipe?.image || 'https://via.placeholder.com/60x60?text=Food'} 
                          alt={item.name || item.recipe?.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginRight: '12px'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=Food';
                          }}
                        />
                        <div>
                          <h6 className="mb-1">{item.name || item.recipe?.name || 'Unknown Item'}</h6>
                          <small className="text-muted">
                            {item.restaurant?.name || item.recipe?.restaurant?.name || 'Restaurant'}
                          </small>
                          {item.description && (
                            <small className="d-block text-muted">{item.description}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      <strong>₹{item.price || item.recipe?.price || 0}</strong>
                    </td>
                    <td className="align-middle" style={{ width: '140px' }}>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1) {
                              handleQuantityChange(item.id || item._id, value);
                            }
                          }}
                          className="mx-2 text-center"
                          style={{ width: '60px' }}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="align-middle">
                      <strong>₹{((item.price || item.recipe?.price || 0) * item.quantity).toFixed(2)}</strong>
                    </td>
                    <td className="align-middle">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id || item._id)}
                        title="Remove item"
                      >
                        🗑️ Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between mt-3">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/restaurants')}
              >
                ← Continue Shopping
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({getTotalItems()}):</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary fs-5">
                    ₹{finalTotal.toFixed(2)}
                  </strong>
                </div>

                {totalPrice < 200 && (
                  <Alert variant="info" className="small">
                    🚚 Add ₹{(200 - totalPrice).toFixed(2)} more for free delivery!
                  </Alert>
                )}

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    🔒 Secure checkout · 🚚 Fast delivery
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;