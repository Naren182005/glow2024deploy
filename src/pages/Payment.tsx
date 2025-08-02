
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import PaymentHeader from '@/components/payment/PaymentHeader';
import CustomQRScanner from '@/components/payment/CustomQRScanner';
import PaymentFooter from '@/components/payment/PaymentFooter';
import { motion } from 'framer-motion';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  
  useEffect(() => {
    // Get checkout info from localStorage
    const checkoutInfo = localStorage.getItem('checkoutInfo');
    if (!checkoutInfo) {
      navigate('/');
      return;
    }
    
    setOrder(JSON.parse(checkoutInfo));
  }, [navigate]);
  
  const handlePaymentComplete = async (transactionId: string) => {
    setTransactionId(transactionId);
    clearCart();
    
    // Store payment information
    localStorage.setItem('orderConfirmed', 'true');
    localStorage.setItem('paymentMethod', 'qrcode');
    localStorage.setItem('transactionId', transactionId);
    
    // Update order status in database
    if (order?.orderId) {
      await updateOrderStatus(order.orderId, 'paid');
    }
    
    // Calculate delivery estimate based on transaction ID (simulated)
    // In a real app, this would be based on user's location/address
    const deliveryDays = (transactionId.length % 3) + 2; // 2-4 days based on transaction ID length
    
    toast({
      title: "Payment Successful!",
      description: `Thank you! Your order has been placed. Our team will deliver it within ${deliveryDays} days based on your location.`,
    });
    
    // Navigate to order confirmation
    navigate('/order-confirmation');
  };
  
  if (transactionId) {
    navigate('/order-confirmation');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">
          <motion.div 
            className="bg-white/5 rounded-lg p-8 border border-white/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PaymentHeader />
            <h2 className="text-white text-xl font-semibold mb-4">Scan & Pay</h2>
            <p className="text-white/70 mb-6">Scan the QR code with any UPI app to complete your payment</p>
            <CustomQRScanner 
              amount={order?.grandTotal} 
              onPaymentComplete={handlePaymentComplete} 
            />
            <PaymentFooter />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
