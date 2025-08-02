
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PaymentHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <button 
        onClick={() => navigate('/checkout')}
        className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Checkout
      </button>
      
      <h1 className="text-3xl font-bold text-white mb-4">Complete Your Payment</h1>
      
      <p className="text-white/80 mb-2">
        Please scan the QR code with any UPI app to complete your payment
      </p>
    </>
  );
};

export default PaymentHeader;
