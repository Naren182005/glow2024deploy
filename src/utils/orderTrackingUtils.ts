
import { TrackingData } from '@/hooks/useOrderTracking';

/**
 * Generates simulated tracking data for orders when API fails
 */
export const simulateTrackingData = (orderId: string): TrackingData => {
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
};
