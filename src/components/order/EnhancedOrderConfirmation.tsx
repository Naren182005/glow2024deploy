import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Calendar, Truck, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrackingData } from '@/hooks/useOrderTracking';
import { simulateTrackingData } from '@/utils/orderTrackingUtils';
import OrderTrackingMap from './OrderTrackingMap';

interface EnhancedOrderConfirmationProps {
  orderId: string;
  paymentMethod: string;
  transactionId?: string;
  shippingAddress: string;
  pincode: string;
}

const EnhancedOrderConfirmation = ({
  orderId,
  paymentMethod,
  transactionId,
  shippingAddress,
  pincode
}: EnhancedOrderConfirmationProps) => {
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  
  useEffect(() => {
    // Simulate tracking data based on order ID
    const data = simulateTrackingData(orderId);
    setTrackingData(data);
  }, [orderId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  const calculateDeliveryDays = () => {
    if (!trackingData?.estimatedDelivery) return '3-5';
    
    const now = new Date();
    const estimatedDate = new Date(trackingData.estimatedDelivery);
    const diffTime = Math.abs(estimatedDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays.toString();
  };
  
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Success Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div 
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Thank You!</h1>
        <p className="text-white/70 text-lg">
          Your order has been placed successfully
        </p>
      </motion.div>
      
      {/* Order Details */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Order Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#F2A83B]/20 rounded-full flex items-center justify-center mr-3">
                <Info size={16} className="text-[#F2A83B]" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Order ID</p>
                <p className="text-white/70 text-sm">{orderId}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#F2A83B]/20 rounded-full flex items-center justify-center mr-3">
                <Calendar size={16} className="text-[#F2A83B]" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Order Date</p>
                <p className="text-white/70 text-sm">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#F2A83B]/20 rounded-full flex items-center justify-center mr-3">
                <Truck size={16} className="text-[#F2A83B]" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Payment Method</p>
                <p className="text-white/70 text-sm">{paymentMethod}</p>
                {transactionId && (
                  <p className="text-white/60 text-xs">Transaction ID: {transactionId}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#F2A83B]/20 rounded-full flex items-center justify-center mr-3">
                <MapPin size={16} className="text-[#F2A83B]" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Delivery Address</p>
                <p className="text-white/70 text-sm">{shippingAddress}</p>
                <p className="text-white/70 text-sm">Pincode: {pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Delivery Tracking */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Delivery Tracking</h2>
          <button 
            onClick={() => setIsMapVisible(prev => !prev)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors"
          >
            {isMapVisible ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
        
        {isMapVisible && trackingData && (
          <div className="h-[250px] rounded-lg overflow-hidden mb-4">
            <OrderTrackingMap trackingData={trackingData} />
          </div>
        )}
        
        <div className="bg-[#F2A83B]/10 border border-[#F2A83B]/30 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <CheckCircle size={18} className="text-green-400 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-white/90 text-sm font-medium">Estimated Delivery</p>
              <p className="text-white/70 text-sm">
                Our team will deliver your order within {calculateDeliveryDays()} days based on your location.
                {trackingData?.estimatedDelivery && (
                  <span className="block mt-1">
                    Expected by: <span className="text-[#F2A83B]">{formatDate(trackingData.estimatedDelivery)}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Status */}
        <div className="space-y-3">
          {trackingData?.stages.map((stage, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stage.completed ? 'bg-green-500' : 'bg-white/20'}`}>
                {stage.completed ? (
                  <CheckCircle size={14} className="text-white" />
                ) : (
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                )}
              </div>
              <div className={`h-8 w-0.5 ${index === trackingData.stages.length - 1 ? 'hidden' : 'block'} ${stage.completed ? 'bg-green-500' : 'bg-white/20'} mx-3`}></div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${stage.completed ? 'text-white' : 'text-white/60'}`}>
                  {stage.name}
                </p>
                {stage.timestamp && (
                  <p className="text-white/50 text-xs">
                    {new Date(stage.timestamp).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Actions */}
      <motion.div
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/')}
          className="bg-[#F2A83B] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#F2A83B]/90 transition-colors flex items-center justify-center"
        >
          Continue Shopping
          <ArrowRight size={16} className="ml-2" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedOrderConfirmation;