
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { simulateTrackingData } from '@/utils/orderTrackingUtils';

export interface TrackingData {
  status: string;
  currentLocation: {
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

export const useOrderTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const { toast } = useToast();

  const getTrackingInfo = async (orderId: string) => {
    if (!orderId) {
      toast({
        title: "Missing Order ID",
        description: "Cannot track order without an Order ID",
        variant: "destructive",
      });
      return null;
    }

    setIsTracking(true);
    
    try {
      // Simulate tracking data
      const data = simulateTrackingData(orderId);
      setTrackingData(data);
      return data;
    } catch (error) {
      console.error("Error tracking order:", error);
      return null;
    } finally {
      setIsTracking(false);
    }
  };

  return {
    getTrackingInfo,
    trackingData,
    isTracking
  };
};
