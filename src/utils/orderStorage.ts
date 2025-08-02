
export const storeOrderInfoLocally = (
  orderId: string,
  customerInfo: {
    address: string;
    name?: string;
    email?: string;
    phone?: string;
  },
  items: any[],
  totalAmount: number,
  shippingCost: number,
  grandTotal: number
) => {
  localStorage.setItem('checkoutInfo', JSON.stringify({
    orderId: orderId,
    customer: customerInfo,
    items,
    totalAmount,
    shippingCost: shippingCost,
    grandTotal: grandTotal,
  }));
};

export const storePaymentMethod = (paymentMethod: 'qrcode' | 'cod') => {
  localStorage.setItem('paymentMethod', paymentMethod);
};

export const storePaymentId = (paymentId: string) => {
  localStorage.setItem('pendingPaymentId', paymentId);
};

export const storeOrderConfirmation = () => {
  localStorage.setItem('orderConfirmed', 'true');
};

export const getStoredPaymentMethod = (): 'qrcode' | 'cod' | null => {
  const method = localStorage.getItem('paymentMethod') as 'qrcode' | 'cod' | null;
  return method;
};

export const getStoredOrderInfo = () => {
  const checkoutInfo = localStorage.getItem('checkoutInfo');
  if (!checkoutInfo) return null;
  
  return JSON.parse(checkoutInfo);
};
