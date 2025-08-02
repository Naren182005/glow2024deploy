
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderHeader = () => {
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
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 rounded-lg p-8 border border-white/10">
        </div>
      </div>
    </>
  );
};

export default OrderHeader;
