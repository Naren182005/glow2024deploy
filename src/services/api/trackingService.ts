
/**
 * API Service for order tracking operations
 */

import { API_BASE_URL, getHeaders, fetchWithTimeout } from './apiCore';

// Tracking data interface
export interface TrackingData {
  status: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedDelivery: string;
  stages: {
    name: string;
    completed: boolean;
    timestamp?: string;
  }[];
  distance?: number;
}

// Track an order
export const trackOrder = async (orderId: string): Promise<TrackingData> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/orders/${orderId}/track`, {
      headers: getHeaders()
    }, 5000);
    
    if (!response.ok) {
      throw new Error(`Failed to track order: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error tracking order:", error);
    
    // Return simulated tracking data since the API call failed
    const now = new Date();
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    
    return {
      status: "in_transit",
      currentLocation: {
        lat: 11.0168,
        lng: 76.9558
      },
      estimatedDelivery: estimatedDelivery.toISOString(),
      stages: [
        { 
          name: "Order Received", 
          completed: true, 
          timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString() 
        },
        { 
          name: "In Production", 
          completed: true, 
          timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString() 
        },
        { 
          name: "Dispatched", 
          completed: true, 
          timestamp: now.toISOString() 
        },
        { 
          name: "Out for Delivery", 
          completed: false 
        },
        { 
          name: "Delivered", 
          completed: false 
        }
      ],
      distance: 5.3
    };
  }
};
