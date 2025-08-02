
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import EnhancedOrderConfirmation from '@/components/order/EnhancedOrderConfirmation';
import { getEstimatedDelivery } from '@/utils/dateUtils';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { getTrackingInfo } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qrcode' | 'cod'>('qrcode');
  const [transactionId, setTransactionId] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  
  useEffect(() => {
    // Check if order is confirmed
    const isConfirmed = localStorage.getItem('orderConfirmed');
    if (!isConfirmed) {
      navigate('/');
      return;
    }
    
    // Make sure cart is cleared
    clearCart();
    
    // Get checkout info
    const checkoutInfo = localStorage.getItem('checkoutInfo');
    if (checkoutInfo) {
      const parsedOrder = JSON.parse(checkoutInfo);
      setOrder(parsedOrder);
      
      // Store order ID if available
      if (parsedOrder.orderId) {
        setOrderId(parsedOrder.orderId);
      } else {
        // Generate a random order ID if not available
        setOrderId('ORD' + Math.floor(100000 + Math.random() * 900000).toString());
      }
      
      // Set shipping address
      setShippingAddress(`${parsedOrder.address || ''}, ${parsedOrder.city || ''}, ${parsedOrder.state || ''}`);
      setPincode(parsedOrder.pincode || '000000');
    }
    
    // Get payment method
    const method = localStorage.getItem('paymentMethod') as 'qrcode' | 'cod';
    if (method) {
      setPaymentMethod(method);
    }
    
    // Get transaction ID if payment method is QR code
    const txnId = localStorage.getItem('transactionId');
    if (txnId) {
      setTransactionId(txnId);
    }
    
    // Show toast notification
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for shopping with Glow24 Organics.",
    });
    
    return () => {
      // Clear localStorage when component unmounts
      localStorage.removeItem('orderConfirmed');
      localStorage.removeItem('checkoutInfo');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('paymentMethod');
    };
  }, [navigate, toast, clearCart, getTrackingInfo]);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#F2A83B] rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <EnhancedOrderConfirmation
          orderId={orderId}
          paymentMethod={paymentMethod}
          transactionId={transactionId}
          shippingAddress={shippingAddress}
          pincode={pincode}
        />
      </div>
    </div>
  );
};

export default OrderConfirmation;
