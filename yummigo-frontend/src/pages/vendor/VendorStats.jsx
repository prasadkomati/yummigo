import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const VendorStats = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({}), [recentOrders, setRecentOrders] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('');

  const demoStats = {
    totalOrders: 47, completedOrders: 38, totalRevenue: 28950, averageOrderValue: 616, thisMonthOrders: 12, thisMonthRevenue: 8450,
    popularItems: [{ name: 'Pizza', orders: 23, revenue: 9177 }, { name: 'Butter Chicken', orders: 18, revenue: 8082 }]
  }, demoOrders = [
    { id: 'ORD-1047', customer: 'Raj', amount: 927, status: 'delivered' },
    { id: 'ORD-1046', customer: 'Priya', amount: 747, status: 'preparing' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!auth.user?.restaurantId) {
          setStats(demoStats); setRecentOrders(demoOrders);
        } else {
          setStats(demoStats); setRecentOrders(demoOrders);
        }
      } catch {
        setError('Error loading stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth.user]);

  const formatCurrency = amt => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /><div>Loading...</div></Container>;

  return (
    <Container className="my-4">
      <h2 className="mb-3">📊 Vendor Stats</h2>
      {error && <Alert variant="info">{error}</Alert>}
      <Row className="mb-4">
        {['Total Orders', 'Revenue', 'Avg Order'].map((label, i) => (
          <Col md={4} key={i}>
            <Card className="text-center shadow-sm"><Card.Body>
              <h5>{label}</h5>
              <h3>{label === 'Total Orders' ? stats.totalOrders : formatCurrency(label === 'Revenue' ? stats.totalRevenue : stats.averageOrderValue)}</h3>
              {i < 2 && <small>+{label === 'Total Orders' ? stats.thisMonthOrders : formatCurrency(stats.thisMonthRevenue)} this month</small>}
            </Card.Body></Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm"><Card.Header>🔥 Popular Items</Card.Header><Card.Body>
            {stats.popularItems?.map((item, i) => (
              <div key={i} className="mb-2"><strong>{item.name}</strong>
                <div className="small text-muted">{item.orders} orders • {formatCurrency(item.revenue)}</div>
              </div>
            ))}
          </Card.Body></Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm"><Card.Header>🧾 Recent Orders</Card.Header>
            <Table responsive hover className="mb-0">
              <thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>{recentOrders.map(o => (
                <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{formatCurrency(o.amount)}</td><td><Badge bg="success">{o.status}</Badge></td></tr>
              ))}</tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorStats;
