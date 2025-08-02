
/**
 * Estimates delivery date (5-7 days from now)
 * @returns formatted date range string
 */
export const getEstimatedDelivery = (): string => {
  const today = new Date();
  const minDelivery = new Date(today);
  minDelivery.setDate(today.getDate() + 5);
  
  const maxDelivery = new Date(today);
  maxDelivery.setDate(today.getDate() + 7);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return `${formatDate(minDelivery)} - ${formatDate(maxDelivery)}`;
};
