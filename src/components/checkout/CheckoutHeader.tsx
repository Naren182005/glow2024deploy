
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CheckoutHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </button>
      
      <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>
    </>
  );
};

export default CheckoutHeader;
