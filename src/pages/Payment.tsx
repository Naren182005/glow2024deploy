
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import PaymentHeader from '@/components/payment/PaymentHeader';
import CustomQRScanner from '@/components/payment/CustomQRScanner';
import PaymentFooter from '@/components/payment/PaymentFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Clock, CheckCircle } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
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
    setIsProcessing(true);
    setTransactionId(transactionId);

    try {
      // Store payment information
      localStorage.setItem('orderConfirmed', 'true');
      localStorage.setItem('paymentMethod', 'qrcode');
      localStorage.setItem('transactionId', transactionId);

      // Update order status in database
      if (order?.orderId) {
        await updateOrderStatus(order.orderId, 'paid');
      }

      // Calculate delivery estimate based on transaction ID (simulated)
      const deliveryDays = (transactionId.length % 3) + 2; // 2-4 days based on transaction ID length

      // Clear cart after successful payment
      clearCart();

      setPaymentCompleted(true);

      toast({
        title: "Payment Successful! 🎉",
        description: `Your order has been confirmed. Expected delivery: ${deliveryDays} days`,
        duration: 5000,
      });

      // Wait a moment to show success state, then navigate
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);

    } catch (error) {
      console.error('Error processing payment completion:', error);
      toast({
        title: "Payment Processing Error",
        description: "Payment received but there was an issue updating your order. Please contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  const goBack = () => {
    navigate('/checkout');
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="bg-white/5 rounded-xl p-8 border border-green-500/20 text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={32} className="text-white" />
          </motion.div>

          <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-white/70 mb-4">
            Transaction ID: <span className="font-mono text-[#F2A83B]">{transactionId}</span>
          </p>
          <p className="text-white/60 text-sm">
            Redirecting to order confirmation...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          onClick={goBack}
          className="flex items-center text-white/70 hover:text-white transition-colors mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Checkout
        </motion.button>

        <div className="max-w-2xl mx-auto">
          {/* Security Banner */}
          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Shield size={20} className="text-green-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium text-sm">Secure Payment</p>
              <p className="text-green-300/80 text-xs">Your payment is protected by bank-grade security</p>
            </div>
          </motion.div>

          {/* Order Summary */}
          {order && (
            <motion.div
              className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal:</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping:</span>
                  <span>₹{order.shippingCost?.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-white font-semibold">
                  <span>Total:</span>
                  <span className="text-[#F2A83B]">₹{order.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Section */}
          <motion.div
            className="bg-white/5 rounded-xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PaymentHeader />

            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-bold mb-2">Complete Your Payment</h2>
              <p className="text-white/70">Scan the QR code or pay manually using UPI</p>
            </div>

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
