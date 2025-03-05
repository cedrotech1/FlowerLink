import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Title from "../../components_part/TitleCard";

// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const BuyerOverview = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/buyer/overview`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching buyer overview:", error);
      }
    };

    fetchData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  // Ensure orderStats exist and avoid undefined values
  const { totalOrders, totalAmountSpent, orderStats } = stats;
  const paidOrders = orderStats?.paid || 0;
  const unpaidOrders = orderStats?.unpaid || 0;
  const refundedOrders = orderStats?.refunded || 0;
  const completedOrders = orderStats?.completed || 0;

  // Data for Pie chart
  const orderChartData = {
    labels: ['Paid', 'Unpaid', 'Refunded', 'Completed'],
    datasets: [{
      data: [paidOrders, unpaidOrders, refundedOrders, completedOrders],
      backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3'], // Green, Red, Orange, Blue
      borderWidth: 1,
    }],
  };

  return (
    <div className="container mt-4">
      <Title title="Buyer Overview" />

      {/* Cards Section */}
      <Row className="mb-4 g-4">
        {/* Orders Statistics Card */}
        <Col xs={12} md={6} lg={4}>
          <Card className="text-white" style={{ backgroundColor: '#2196f3' }}>
            <Card.Body>
              <Card.Title><FaShoppingCart size={32} color="white" /> Orders</Card.Title>
              <Card.Text>
                <strong>Total Orders:</strong> {totalOrders}
              </Card.Text>
              <Card.Text>
                <strong>Paid:</strong> {paidOrders} <Badge bg="success">Paid</Badge>
              </Card.Text>
              <Card.Text>
                <strong>Unpaid:</strong> {unpaidOrders} <Badge bg="danger">Unpaid</Badge>
              </Card.Text>
              <Card.Text>
                <strong>Refunded:</strong> {refundedOrders} <Badge bg="warning">Refunded</Badge>
              </Card.Text>
              <Card.Text>
                <strong>Completed:</strong> {completedOrders} <Badge bg="primary">Completed</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Spent Card */}
        <Col xs={12} md={6} lg={4}>
          <Card className="text-white" style={{ backgroundColor: '#ff9800' }}>
            <Card.Body>
              <Card.Title><FaDollarSign size={32} color="white" /> Total Spent</Card.Title>
              <Card.Text>
                <strong>Total Spent:</strong> ${totalAmountSpent}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphs Section */}
      <Row className="mb-4 g-4">
        <Col xs={8}>
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

export default BuyerOverview;
