
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { LoaderCircle } from 'lucide-react';

const PaymentRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'cod'>('gpay');

  useEffect(() => {
    // Get payment method from localStorage
    const storedMethod = localStorage.getItem('paymentMethod') as 'gpay' | 'cod';
    if (storedMethod) {
      setPaymentMethod(storedMethod);
    }

    // Simulate payment verification
    const timer = setTimeout(() => {
      // Mark order as confirmed
      localStorage.setItem('orderConfirmed', 'true');
      // Clear cart
      clearCart();
      
      // Show success toast based on payment method
      if (paymentMethod === 'gpay') {
        toast({
          title: "Google Pay Payment Successful!",
          description: "Your payment has been processed through Google Pay. Redirecting to order confirmation.",
        });
      } else {
        toast({
          title: "Order Confirmed for Blue Dart Delivery!",
          description: "Your order has been confirmed for Cash on Delivery via Blue Dart. Redirecting to order confirmation.",
        });
      }
      
      // Redirect to order confirmation
      navigate('/order-confirmation');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate, toast, clearCart, paymentMethod]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white/5 rounded-lg p-8 border border-white/10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-6">
          {paymentMethod === 'gpay' && 'Processing Google Pay Payment'}
          {paymentMethod === 'cod' && 'Confirming Blue Dart Delivery'}
        </h1>
        
        <div className="flex flex-col items-center justify-center py-8">
          <LoaderCircle size={48} 
            className={`animate-spin mb-4 ${paymentMethod === 'gpay' ? 'text-green-500' : 'text-blue-500'}`} 
          />
          <p className="text-white/80">
            {paymentMethod === 'gpay' && 'Processing your Google Pay transaction...'}
            {paymentMethod === 'cod' && 'Confirming your Blue Dart delivery details...'}
          </p>
          <p className="text-white/60 text-sm mt-2">Please do not close this window</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentRedirect;
