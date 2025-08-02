import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Truck, Info, CheckCircle, Calendar, Package, User, Mail } from 'lucide-react';
import OrderTrackingMap from '../order/OrderTrackingMap';
import { TrackingData } from '@/hooks/useOrderTracking';
import { simulateTrackingData } from '@/utils/orderTrackingUtils';

interface EnhancedCODFlowProps {
  orderDetails: {
    id: string;
    items: any[];
    total: number;
    shippingAddress: string;
    pincode: string;
  };
  onConfirm: () => void;
}

const EnhancedCODFlow = ({ orderDetails, onConfirm }: EnhancedCODFlowProps) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  
  useEffect(() => {
    // Simulate tracking data based on order ID
    const data = simulateTrackingData(orderDetails.id);
    setTrackingData(data);
  }, [orderDetails.id]);
  
  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm();
  };
  
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
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-white text-xl font-semibold mb-6 flex items-center">
          <Package className="text-[#F2A83B] mr-2" size={24} />
          Order #{orderDetails.id.substring(0, 8)}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Map Section */}
          <motion.div 
            className="w-full md:w-1/2 rounded-lg overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-black/20 rounded-lg p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <MapPin size={18} className="text-[#F2A83B] mr-2" />
                  Delivery Location
                </h3>
                <button 
                  onClick={() => setIsMapVisible(prev => !prev)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors"
                >
                  {isMapVisible ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
              
              {isMapVisible && trackingData && (
                <div className="h-[250px] rounded-lg overflow-hidden">
                  <OrderTrackingMap trackingData={trackingData} />
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                <div className="flex items-start">
                  <MapPin size={18} className="text-[#F2A83B] mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Delivery Address</p>
                    <p className="text-white/70 text-sm">{orderDetails.shippingAddress}</p>
                    <p className="text-white/70 text-sm">Pincode: {orderDetails.pincode}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={18} className="text-[#F2A83B] mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Estimated Delivery</p>
                    <p className="text-white/70 text-sm">
                      {trackingData?.estimatedDelivery ? formatDate(trackingData.estimatedDelivery) : 'Calculating...'}
                    </p>
                    <p className="text-white/60 text-xs">
                      (Within {calculateDeliveryDays()} days based on your location)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Order Summary Section */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-black/20 rounded-lg p-4 h-full">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/10 rounded-md mr-3 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 bg-[#F2A83B]/20 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white/90 text-sm">{item.name}</p>
                        <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between">
                  <p className="text-white/70 text-sm">Subtotal</p>
                  <p className="text-white/90 text-sm">₹{orderDetails.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-white/70 text-sm">Shipping</p>
                  <p className="text-white/90 text-sm">Free</p>
                </div>
                <div className="flex justify-between font-medium">
                  <p className="text-white/90">Total</p>
                  <p className="text-[#F2A83B]">₹{orderDetails.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Support & Payment Info */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Info size={18} className="text-[#F2A83B] mr-2" />
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="bg-[#F2A83B]/10 border border-[#F2A83B]/30 rounded-lg p-3">
                <div className="flex items-start">
                  <Truck size={18} className="text-[#F2A83B] mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/70 text-sm">
                      Pay with cash when your order is delivered. Our delivery partner will collect the payment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-start">
                  <CheckCircle size={18} className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Delivery Estimate</p>
                    <p className="text-white/70 text-sm">
                      Your order will be delivered within {calculateDeliveryDays()} days based on your location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Phone size={18} className="text-[#F2A83B] mr-2" />
              Support Information
            </h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/90 text-sm font-medium">Need help with your order?</p>
                <p className="text-white/70 text-sm mb-2">
                  Our customer support team is available to assist you.
                </p>
                <div className="flex space-x-3">
                  <a href="tel:+919876543210" className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors flex items-center">
                    <Phone size={12} className="mr-1" /> Call Support
                  </a>
                  <a href="mailto:support@glow24.com" className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors">
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Confirm Button */}
      <motion.div
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <button
          onClick={handleConfirmOrder}
          disabled={isConfirming}
          className="bg-[#F2A83B] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#F2A83B]/90 transition-colors disabled:opacity-70 flex items-center justify-center w-full md:w-auto"
        >
          {isConfirming ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            'Confirm Cash on Delivery Order'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedCODFlow;