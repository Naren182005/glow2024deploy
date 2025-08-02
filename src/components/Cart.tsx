
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, isOpen, totalAmount, itemCount, removeFromCart, updateQuantity, closeCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    // Store cart items in localStorage before navigating
    localStorage.setItem('cartItems', JSON.stringify(items));
    localStorage.setItem('cartTotal', totalAmount.toString());
    
    // Navigate to checkout page
    navigate('/checkout');
    closeCart();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      ></div>
      
      {/* Cart panel */}
      <div className="relative w-full max-w-md bg-black border-l border-[#F2A83B]/20 shadow-xl animate-slide-in h-full overflow-auto">
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="text-[#F2A83B]" size={24} />
              Your Cart
              <span className="ml-2 text-sm font-medium bg-[#F2A83B] text-black px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </h2>
            <button 
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {/* Empty cart message */}
          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag size={64} className="text-white/20 mb-4" />
              <p className="text-white/70 text-lg">Your cart is empty</p>
              <p className="text-white/50 text-sm mt-2">
                Add some products to see them here
              </p>
              <button 
                onClick={closeCart}
                className="mt-6 px-6 py-2 bg-[#F2A83B] text-black rounded-full hover:bg-[#F2A83B]/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
          
          {/* Cart items */}
          {items.length > 0 && (
            <>
              <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="h-20 w-20 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/50 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <p className="text-white/60 text-sm line-clamp-1 mt-1">
                          {item.description}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-white/20 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 text-white"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2 text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <p className="font-bold text-[#F2A83B]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cart summary */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white font-medium">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-white/70">Shipping</span>
                  <span className="text-white font-medium">Calculated at checkout</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={closeCart}
                  className="w-full py-3 bg-transparent text-white border border-white/20 rounded-md mt-2 font-medium hover:bg-white/5 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
