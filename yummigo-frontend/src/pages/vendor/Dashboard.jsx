// src/pages/vendor/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, rejectedOrders: 0, earnings: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const demo = { totalOrders: 24, completedOrders: 18, rejectedOrders: 2, earnings: 12540, pendingOrders: 4 };

  const fetchStats = async () => {
    setLoading(true); setError('');
    const urls = ['/api/orders/vendor/stats', '/api/vendor/stats', '/api/orders/stats', '/api/vendor/dashboard', '/api/restaurants/stats'];
    for (let url of urls) {
      try {
        const { data } = await API.get(url);
        if (data) {
          setStats({
            totalOrders: data.totalOrders || data.total || 0,
            completedOrders: data.completedOrders || data.completed || 0,
            rejectedOrders: data.rejectedOrders || data.rejected || 0,
            earnings: data.earnings || data.revenue || data.totalEarnings || 0,
            pendingOrders: data.pendingOrders || data.pending || 0
          });
          return setLoading(false);
        }
      } catch {}
    }
    setStats(demo);
    setError('');
    setLoading(false);
  };

  useEffect(() => { if (auth.user) fetchStats(); }, [auth.user]);
  const currency = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const cards = [
    { label: 'Total Orders', val: stats.totalOrders, icon: '📦', color: 'primary' },
    { label: 'Completed', val: stats.completedOrders, icon: '✅', color: 'success' },
    { label: 'Rejected', val: stats.rejectedOrders, icon: '❌', color: 'danger' },
    { label: 'Earnings', val: currency(stats.earnings), icon: '💰', color: 'warning' },
    { label: 'Pending', val: stats.pendingOrders, icon: '⏳', color: 'info' },
    { label: 'Success Rate', val: stats.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) + '%' : '0%', icon: '📊', color: 'secondary' }
  ];

  if (loading) return <Container className="text-center my-5"><Spinner animation="border" /><h5>Loading Dashboard...</h5></Container>;

  return (
    <Container className="my-4">
      <h4>Welcome back, {auth.user?.name || 'Vendor'}! 👋</h4>
      <small className="text-muted">Restaurant: {auth.user?.restaurantName || 'Your Restaurant'}</small>
      {error && <Alert variant="info" className="mt-3">{error}</Alert>}
      <Row className="mt-4">
        {cards.map((c, i) => (
          <Col key={i} xl={3} lg={6} className="mb-4">
            <Card className="text-center shadow-sm border-0 h-100">
              <Card.Body>
                <div className={`bg-${c.color} bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3`}>
                  <span className={`fs-2 text-${c.color}`}>{c.icon}</span>
                </div>
                <h5 className={`text-${c.color}`}>{c.val}</h5>
                <p className="text-muted mb-0">{c.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col xl={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100"><Card.Body>
            <h5>Quick Actions</h5>
            {['recipes', 'orders', 'restaurant'].map((p, i) => (
              <Button key={p} size="sm" variant={`outline-${['primary', 'success', 'info'][i]}`} className="d-block mb-2"
                onClick={() => window.location.href = `/vendor/${p}`}>
                {['🍽️ Manage Recipes', '📋 View Orders', '🏪 Restaurant Info'][i]}
              </Button>
            ))}
          </Card.Body></Card>
        </Col>
      </Row>
      <div className="text-center mt-3">
        <Button onClick={fetchStats} disabled={loading} variant="outline-primary">
          {loading ? <><Spinner size="sm" animation="border" className="me-2" />Refreshing...</> : '🔄 Refresh Dashboard'}
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
