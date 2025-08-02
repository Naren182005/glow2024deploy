
import { useOrderCreation } from './useOrderCreation';
import { useOrderTracking } from './useOrderTracking';
import { useOrderStatus } from './useOrderStatus';

export const useOrders = () => {
  const { createOrder, isCreating } = useOrderCreation();
  const { getTrackingInfo, trackingData, isTracking } = useOrderTracking();
  const { updateOrderStatus } = useOrderStatus();

  return {
    createOrder,
    getTrackingInfo,
    updateOrderStatus,
    trackingData,
    isCreating,
    isTracking
  };
};
