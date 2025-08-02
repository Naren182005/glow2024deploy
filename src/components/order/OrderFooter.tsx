
import { useNavigate } from 'react-router-dom';

const OrderFooter = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8 text-center">
      <button
        onClick={() => navigate('/')}
        className="py-3 px-8 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors"
      >
        Continue Shopping
      </button>
      
      <p className="mt-4 text-white/60 text-sm">
        Have questions about your order? Contact our customer support.
      </p>
    </div>
  );
};

export default OrderFooter;
