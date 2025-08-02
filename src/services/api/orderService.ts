
/**
 * API Service for order operations
 */

import { API_BASE_URL, getHeaders, fetchWithTimeout } from './apiCore';

// Order data interface
export interface OrderData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: 'gpay' | 'cod';
}

// Submit an order
export const submitOrder = async (orderData: OrderData): Promise<{ orderId: string }> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    }, 5000);

    if (!response.ok) {
      throw new Error(`Order submission failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting order:", error);
    // Generate a local order ID since the API call failed
    return { orderId: crypto.randomUUID() };
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }, 5000);
    
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};
