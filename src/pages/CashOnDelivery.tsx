import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import EnhancedCODFlow from '@/components/payment/EnhancedCODFlow';
import { motion } from 'framer-motion';

const CashOnDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    // Get checkout info from localStorage
    const checkoutInfo = localStorage.getItem('checkoutInfo');
    if (!checkoutInfo) {
      navigate('/');
      return;
    }
    
    setOrder(JSON.parse(checkoutInfo));
  }, [navigate]);
  
  const handleConfirmOrder = async () => {
    clearCart();
    
    // Store order information
    localStorage.setItem('orderConfirmed', 'true');
    localStorage.setItem('paymentMethod', 'cod');
    
    // Update order status in database
    if (order?.orderId) {
      await updateOrderStatus(order.orderId, 'pending');
    }
    
    // Calculate delivery estimate based on address (simulated)
    // In a real app, this would be based on user's location/address
    const deliveryDays = order?.pincode ? (parseInt(order.pincode) % 3) + 2 : 3; // 2-4 days based on pincode
    
    toast({
      title: "Order Confirmed!",
      description: `Thank you! Your order has been placed. Our team will deliver it within ${deliveryDays} days based on your location.`,
    });
    
    // Navigate to order confirmation
    navigate('/order-confirmation');
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#F2A83B] rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Format order data for the EnhancedCODFlow component
  const orderDetails = {
    id: order.orderId || 'ORD' + Math.floor(Math.random() * 1000000),
    items: order.items || [],
    total: order.grandTotal || 0,
    shippingAddress: `${order.address}, ${order.city}, ${order.state}`,
    pincode: order.pincode || '000000',
  };
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-white text-2xl font-bold mb-6 text-center">Cash on Delivery</h1>
          <EnhancedCODFlow 
            orderDetails={orderDetails}
            onConfirm={handleConfirmOrder}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CashOnDelivery;