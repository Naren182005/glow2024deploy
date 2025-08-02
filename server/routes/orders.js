
const express = require('express');
const router = express.Router();

// Sample order status data (in a real application, this would come from a database)
const orderStatus = {
  "12345": {
    orderId: "12345",
    status: "shipped",
    trackingNumber: "IND12345678",
    estimatedDelivery: "2025-04-15",
    currentLocation: "Mumbai, India",
    orderDate: "2025-04-05",
    items: [
      { id: 1, name: "Hair Oil", quantity: 2, price: 199 },
      { id: 3, name: "Golden Serum (15ml)", quantity: 1, price: 250 }
    ],
    customer: {
      name: "Ravi Kumar",
      email: "ravi@example.com",
      address: "123 Main St, Mumbai, Maharashtra, India"
    },
    statusHistory: [
      { status: "order_placed", date: "2025-04-05T08:30:00Z" },
      { status: "processing", date: "2025-04-06T10:15:00Z" },
      { status: "shipped", date: "2025-04-07T14:00:00Z" }
    ]
  }
};

// Create a new order
router.post('/', (req, res) => {
  const { customer, items, paymentMethod, shippingAddress } = req.body;
  
  // In a real application, you would save this to a database
  // Generate a random order ID for demonstration
  const orderId = `ORD${Math.floor(Math.random() * 100000)}`;
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      orderId,
      message: "Order created successfully"
    });
  }, 800);
});

// Get tracking information for an order
router.get('/:orderId/track', (req, res) => {
  const orderId = req.params.orderId;
  const order = orderStatus[orderId];
  
  if (!order) {
    // If the order isn't found in our sample data,
    // generate a random order status for demonstration
    const statuses = ["processing", "shipped", "delivered"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return res.json({
      orderId,
      status: randomStatus,
      trackingNumber: `TR${Math.floor(Math.random() * 1000000)}`,
      estimatedDelivery: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
      currentLocation: "Distribution Center",
      statusHistory: [
        { status: "order_placed", date: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
        { status: randomStatus, date: new Date().toISOString() }
      ]
    });
  }
  
  res.json(order);
});

// Update order status
router.put('/:orderId/status', (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  
  // In a real application, you would update the database
  
  res.json({
    success: true,
    orderId,
    status,
    message: "Order status updated successfully"
  });
});

module.exports = router;
