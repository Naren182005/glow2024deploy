
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, Navigation2, Home } from 'lucide-react';

interface OrderTrackingMapProps {
  trackingData: {
    status: string;
    currentLocation: { lat: number; lng: number };
    estimatedDelivery: string;
    stages: {
      name: string;
      completed: boolean;
      timestamp?: string;
    }[];
    distance?: number;
  };
  driverName?: string;
}

const OrderTrackingMap = ({ trackingData, driverName = 'Delivery Agent' }: OrderTrackingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // In a real implementation, you would use a mapping service like Google Maps, Mapbox, etc.
  // For this demo, we'll create a simulated map experience
  
  useEffect(() => {
    // This would be replaced with actual map initialization code
    const mapLoadingTimeout = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(mapLoadingTimeout);
  }, []);
  
  return (
    <div className="rounded-lg overflow-hidden bg-black/40 border border-white/10">
      <div className="relative w-full aspect-[16/9]">
        {!isMapLoaded && !mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-8 h-8 border-2 border-[#F2A83B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4">
            <p className="text-white/70 text-center">Unable to load tracking map</p>
            <button 
              className="mt-2 px-4 py-2 bg-[#F2A83B] text-black rounded-md text-sm"
              onClick={() => {
                setMapError(false);
                setIsMapLoaded(false);
                // This would trigger map reload in a real implementation
                setTimeout(() => setIsMapLoaded(true), 1500);
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full relative">
            {/* Simulated map with gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
            
            {/* Simulated map elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-white/40"></div>
              <div className="absolute top-2/4 left-1/4 w-1/2 h-px bg-white/40"></div>
              <div className="absolute top-3/4 left-1/4 w-1/2 h-px bg-white/40"></div>
              <div className="absolute left-1/4 top-1/4 w-px h-1/2 bg-white/40"></div>
              <div className="absolute left-2/4 top-1/4 w-px h-1/2 bg-white/40"></div>
              <div className="absolute left-3/4 top-1/4 w-px h-1/2 bg-white/40"></div>
            </div>
            
            {/* Destination marker */}
            <div className="absolute top-1/4 left-3/4 translate-x-[-50%] translate-y-[-50%]">
              <motion.div 
                className="w-4 h-4 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full opacity-20"></div>
            </div>
            
            {/* Delivery agent marker */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ x: -100, y: 50 }}
              animate={{ 
                x: 0, 
                y: 0,
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                x: { duration: 10, repeat: Infinity, repeatType: "reverse" },
                y: { duration: 8, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 4, repeat: Infinity }
              }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-[#F2A83B] rounded-full flex items-center justify-center">
                  <Navigation2 size={16} className="text-black" />
                </div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Check size={6} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Path between points (simplified) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              <motion.path 
                d="M 25% 50% Q 50% 30%, 75% 25%" 
                fill="none"
                stroke="#F2A83B"
                strokeWidth="2"
                strokeDasharray="6 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </svg>
          </div>
        )}
      </div>
      
      {isMapLoaded && !mapError && (
        <motion.div 
          className="p-4 bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-white text-sm font-medium">{driverName}</p>
              </div>
              <p className="text-white/60 text-xs mt-1">Your delivery agent</p>
            </div>
            
            <div className="text-right">
              <p className="text-white text-sm">
                <span className="text-[#F2A83B]">{trackingData.distance ? `${trackingData.distance.toFixed(1)} km` : 'Calculating...'}</span> away
              </p>
              <p className="text-white/60 text-xs mt-1">
                Estimated delivery: <span className="text-[#F2A83B]">{new Date(trackingData.estimatedDelivery).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTrackingMap;
