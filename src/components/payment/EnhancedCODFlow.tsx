import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Truck, Info, CheckCircle, Calendar, Package, User, Mail, MessageCircle } from 'lucide-react';
import OrderTrackingMap from '../order/OrderTrackingMap';
import { TrackingData } from '@/hooks/useOrderTracking';
import { simulateTrackingData } from '@/utils/orderTrackingUtils';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

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

  // Function to generate WhatsApp message with all order details
  const generateWhatsAppMessage = () => {
    const customerInfo = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Debug logging
    console.log('🔍 Debug - Customer Info from localStorage:', customerInfo);
    console.log('🔍 Debug - Cart Items from localStorage:', cartItems);

    let message = `🛍️ *NEW ORDER FROM GLOW24 ORGANICS*\n\n`;
    message += `📋 *Order ID:* ${orderDetails.id}\n\n`;

    // Customer Details
    message += `👤 *CUSTOMER DETAILS:*\n`;
    message += `Name: ${customerInfo.name || 'Not provided'}\n`;
    message += `Email: ${customerInfo.email || 'Not provided'}\n`;
    message += `Phone: ${customerInfo.phone || 'Not provided'}\n\n`;

    // Shipping Address
    message += `📍 *SHIPPING ADDRESS:*\n`;
    message += `${customerInfo.address || orderDetails.shippingAddress || 'Not provided'}\n`;
    message += `City: ${customerInfo.city || 'Not provided'}\n`;
    message += `State: ${customerInfo.state || 'Not provided'}\n`;
    message += `Pincode: ${customerInfo.pincode || orderDetails.pincode || 'Not provided'}\n\n`;

    // Order Items
    message += `🛒 *ORDER ITEMS:*\n`;
    if (cartItems.length > 0) {
      cartItems.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₹${item.price}\n`;
        message += `   Subtotal: ₹${item.price * item.quantity}\n\n`;
      });
    } else if (orderDetails.items) {
      orderDetails.items.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₹${item.price}\n`;
        message += `   Subtotal: ₹${item.price * item.quantity}\n\n`;
      });
    }

    // Order Total
    message += `💰 *ORDER TOTAL: ₹${orderDetails.total}*\n\n`;

    // Payment Method
    message += `💳 *Payment Method:* Cash on Delivery\n\n`;

    // Additional Info
    message += `📅 *Order Date:* ${new Date().toLocaleDateString('en-IN')}\n`;
    message += `⏰ *Order Time:* ${new Date().toLocaleTimeString('en-IN')}\n\n`;

    message += `✅ *Please confirm this order and provide delivery timeline.*\n\n`;
    message += `Thank you for choosing Glow24 Organics! 🌿`;

    return encodeURIComponent(message);
  };
  
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
        <div className="flex justify-center">
          <div className="w-full max-w-md">
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
                  <a href="tel:+919363717744" className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors flex items-center">
                    <Phone size={12} className="mr-1" /> Call Support
                  </a>
                  <a href="mailto:glow24@gmail.com" className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors">
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* WhatsApp Submit Button */}
      <motion.div
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <a
          href={`https://wa.me/+919363717744?text=${generateWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 w-full md:w-auto hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <MessageCircle size={24} />
          <span className="text-lg">Submit your order to WhatsApp</span>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedCODFlow;