
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
}

const OrderItemsList = ({ items, totalAmount, shippingCost, grandTotal }: OrderItemsListProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items?.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-start">
              <span className="bg-white/20 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                {item.quantity}
              </span>
              <span className="text-white">{item.name}</span>
            </div>
            <span className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Subtotal</span>
          <span className="text-white">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Shipping</span>
          <span className="text-white">
            {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
          </span>
        </div>
        
        <div className="border-t border-white/10 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-white/70 font-medium">Total</span>
            <span className="text-[#F2A83B] font-bold">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItemsList;
