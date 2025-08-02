
import { handleQRCodePayment, handleBlueDartCOD } from '@/services/paymentService';
import { storePaymentMethod, storeOrderConfirmation } from './orderStorage';
import { useToast } from '@/hooks/use-toast';

export const processPayment = async (
  orderId: string,
  paymentMethod: 'qrcode' | 'cod',
  amount: number,
  shippingAddress: string,
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
  }
) => {
  try {
    // Store payment method for later reference
    storePaymentMethod(paymentMethod);

    // Handle payment based on selected method
    if (paymentMethod === 'qrcode') {
      // Handle QR code payment with the exact amount
      await handleQRCodePayment(
        orderId,
        amount,
        {
          name: customerInfo.name || 'Customer',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
        }
      );
    } else if (paymentMethod === 'cod') {
      // Handle Blue Dart COD integration
      await handleBlueDartCOD(
        orderId,
        shippingAddress,
        {
          name: customerInfo.name || 'Customer',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
        }
      );
    }

    return true;
  } catch (error) {
    console.error(`Error processing ${paymentMethod} payment:`, error);
    return false;
  }
};

export const showPaymentToast = (
  toast: any,
  paymentMethod: 'qrcode' | 'cod'
) => {
  if (paymentMethod === 'qrcode') {
    toast({
      title: "Preparing QR Code",
      description: "We're generating your payment QR code. Please wait...",
      duration: 3000,
    });
  } else if (paymentMethod === 'cod') {
    toast({
      title: "Preparing Cash on Delivery",
      description: "We're setting up your Cash on Delivery order. Please wait...",
      duration: 3000,
    });
  }
};
