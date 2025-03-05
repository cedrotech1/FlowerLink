import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Title from "../../components_part/TitleCard";

ChartJS.register(ArcElement, Tooltip, Legend);

const OverviewStatistics = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/admin/overview`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setStats(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!stats) return <div>Loading...</div>;

  // Ensure missing keys don't break the UI
  const { userStats, productStats, orderStats, platformProfit } = stats;
  
  const totalUsers = userStats?.totalUsers || 0;
  const buyers = userStats?.buyers || 0;
  const sellers = userStats?.sellers || 0;
  const admins = userStats?.admins || 0;

  const totalProducts = productStats?.totalProducts || 0;
  const inStock = productStats?.["In Stock"] || 0;
  const outOfStock = productStats?.["Out of Stock"] || 0;
  const rejected = productStats?.rejected || 0;

  const totalOrders = orderStats?.totalOrders || 0;
  const paidOrders = orderStats?.paid || 0;
  const completedOrders = orderStats?.completed || 0;
  const totalRevenue = orderStats?.totalRevenue || 0;

  // Data for Pie charts
  const userChartData = {
    labels: ['Buyers', 'Sellers', 'Admins'],
    datasets: [{
      data: [buyers, sellers, admins],
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
      borderWidth: 1,
    }],
  };

  const productChartData = {
    labels: ['In Stock', 'Out of Stock', 'Rejected'],
    datasets: [{
      data: [inStock, outOfStock, rejected],
      backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      borderWidth: 1,
    }],
  };

  const orderChartData = {
    labels: ['Paid', 'Completed', 'Unpaid'],
    datasets: [{
      data: [paidOrders, completedOrders, totalOrders - paidOrders],
      backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
      borderWidth: 1,
    }],
  };

  return (
    <div className="container mt-4">
      <Title title={'Admin Dashboard Overview'} />

      {/* Cards Section */}
      <Row className="mb-4 g-4">
        {/* Users Statistics Card */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white" style={{ backgroundColor: '#2196f3' }}>
            <Card.Body>
              <Card.Title><FaUsers size={32} color="white" /> Users</Card.Title>
              <Card.Text><strong>Total Users:</strong> {totalUsers}</Card.Text>
              <Card.Text><strong>Buyers:</strong> {buyers}</Card.Text>
              <Card.Text><strong>Sellers:</strong> {sellers}</Card.Text>
              <Card.Text><strong>Admins:</strong> {admins}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Statistics Card */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white" style={{ backgroundColor: '#4caf50' }}>
            <Card.Body>
              <Card.Title><FaBox size={32} color="white" /> Products</Card.Title>
              <Card.Text><strong>Total Products:</strong> {totalProducts}</Card.Text>
              <Card.Text><strong>In Stock:</strong> {inStock}</Card.Text>
              <Card.Text><strong>Out of Stock:</strong> {outOfStock}</Card.Text>
              <Card.Text><strong>Rejected:</strong> {rejected}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Orders Statistics Card */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white" style={{ backgroundColor: '#ff9800' }}>
            <Card.Body>
              <Card.Title><FaShoppingCart size={32} color="white" /> Orders</Card.Title>
              <Card.Text><strong>Total Orders:</strong> {totalOrders}</Card.Text>
              <Card.Text><strong>Completed:</strong> {completedOrders}</Card.Text>
              <Card.Text><strong>Paid:</strong> {paidOrders}</Card.Text>
              <Card.Text><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Profit Card */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white" style={{ backgroundColor: '#9c27b0' }}>
            <Card.Body>
              <Card.Title><FaDollarSign size={32} color="white" /> Total Profit</Card.Title>
              <Card.Text><strong>Profit:</strong> ${platformProfit.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphs Section */}
      <Row className="mb-4 g-4">
        {/* Users Chart */}
        <Col xs={12} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>User Breakdown</Card.Title>
              <Pie data={userChartData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Products Chart */}
        <Col xs={12} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Product Breakdown</Card.Title>
              <Pie data={productChartData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Orders Chart */}
        <Col xs={12} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Breakdown</Card.Title>
              <Pie data={orderChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewStatistics;
