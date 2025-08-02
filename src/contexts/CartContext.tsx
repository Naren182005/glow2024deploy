
import React, { createContext, useState, useEffect } from 'react';
import { ProductProps } from '@/components/ProductCard';
import { useNavigate } from 'react-router-dom';

interface CartItem extends ProductProps {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalAmount: number;
  itemCount: number;
  addToCart: (product: ProductProps) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  proceedToCheckout: () => void;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  totalAmount: 0,
  itemCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
  proceedToCheckout: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total amount and item count whenever items change
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    
    setTotalAmount(total);
    setItemCount(count);
  }, [items]);

  const addToCart = (product: ProductProps) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Open cart when adding items
    setIsOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const proceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        isOpen, 
        totalAmount, 
        itemCount,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        openCart,
        closeCart,
        proceedToCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
