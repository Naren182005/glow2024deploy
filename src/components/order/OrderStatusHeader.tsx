
import { CheckCircle } from 'lucide-react';

const OrderStatusHeader = () => {
  return (
    <div className="flex items-center justify-center mb-6">
      <CheckCircle size={48} className="text-green-500 mr-4" />
      <div>
        <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
        <p className="text-white/70">Thank you for shopping with Glow24 Organics</p>
      </div>
    </div>
  );
};

export default OrderStatusHeader;
