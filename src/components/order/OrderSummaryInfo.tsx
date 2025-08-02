
interface OrderSummaryInfoProps {
  orderNumber: string;
  paymentMethod: 'qr' | 'cod';
  estimatedDelivery: string;
}

const OrderSummaryInfo = ({ orderNumber, paymentMethod, estimatedDelivery }: OrderSummaryInfoProps) => {
  return (
    <div className="border border-white/10 rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-white/70">Order Number:</span>
        <span className="text-white font-medium">{orderNumber}</span>
      </div>
      
      <div className="flex justify-between mb-2">
        <span className="text-white/70">Payment Method:</span>
        <span className="text-white font-medium">
          {paymentMethod === 'qr' ? 'Online Payment (UPI)' : 'Cash on Delivery'}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-white/70">Estimated Delivery:</span>
        <span className="text-white font-medium">{estimatedDelivery}</span>
      </div>
    </div>
  );
};

export default OrderSummaryInfo;
