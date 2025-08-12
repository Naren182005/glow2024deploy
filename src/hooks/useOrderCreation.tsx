
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { generateOrderId } from '@/utils/uuid';

// Define OrderData interface locally since we removed the API services
interface OrderData {
  shippingAddress: string;
  paymentMethod: 'qrcode' | 'cod';
  shippingCost: number;
  grandTotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
import { 
  storeOrderInfoLocally,
  storePaymentMethod,
  storeOrderConfirmation
} from '@/utils/orderStorage';
import {
  processPayment,
  showPaymentToast
} from '@/utils/paymentProcessor';

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { items, totalAmount } = useCart();

  const createOrder = async (orderDetails: {
    shippingAddress: string;
    paymentMethod: 'qrcode' | 'cod';
    shippingCost: number;
    grandTotal: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) => {
    setIsCreating(true);

    try {
      const orderId = generateOrderId();
      
      const orderData: OrderData = {
        customerName: orderDetails.customerName || 'Guest',
        customerEmail: orderDetails.customerEmail,
        customerPhone: orderDetails.customerPhone,
        shippingAddress: orderDetails.shippingAddress,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalAmount,
        shippingCost: orderDetails.shippingCost,
        grandTotal: orderDetails.grandTotal,
        paymentMethod: orderDetails.paymentMethod
      };
      
      storeOrderInfoLocally(
        orderId,
        {
          address: orderDetails.shippingAddress,
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          phone: orderDetails.customerPhone
        },
        items,
        totalAmount,
        orderDetails.shippingCost,
        orderDetails.grandTotal
      );
      
      storePaymentMethod(orderDetails.paymentMethod);
      
      showPaymentToast(toast, orderDetails.paymentMethod);
      
      await processPayment(
        orderId,
        orderDetails.paymentMethod,
        orderDetails.grandTotal,
        orderDetails.shippingAddress,
        {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          phone: orderDetails.customerPhone
        }
      );
      
      // Since we're not using backend, just use the locally generated orderId
      storeOrderConfirmation();
      return { id: orderId };
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.message || "There was a problem creating your order. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createOrder,
    isCreating
  };
};
