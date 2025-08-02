
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  amount: number;
}

const QRCodeDisplay = ({ amount }: QRCodeDisplayProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Preload image
    const img = new Image();
    img.src = "/lovable-uploads/3072898f-0ccc-4826-9143-24cea560e44c.png";
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => setHasError(true);
  }, []);
  
  return (
    <motion.div 
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center mb-4 space-x-2">
        <Shield size={18} className="text-[#F2A83B]" />
        <p className="text-[#F2A83B] font-medium text-lg">
          Amount: ₹{amount?.toFixed(2)}
        </p>
      </div>
      
      <AnimatePresence>
        {!isImageLoaded && !hasError && (
          <motion.div 
            className="w-64 h-64 flex items-center justify-center bg-black/40 rounded-lg"
            exit={{ opacity: 0 }}
          >
            <div className="w-12 h-12 rounded-full border-4 border-[#F2A83B] border-t-transparent animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={`bg-white p-5 rounded-lg mb-5 shadow-lg shadow-white/10 ${isImageLoaded ? 'block' : 'hidden'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: isImageLoaded ? 1 : 0.9,
          opacity: isImageLoaded ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {hasError ? (
          <div className="w-64 h-64 bg-black/30 rounded-lg flex flex-col items-center justify-center">
            <p className="text-white/80 text-sm mb-2">Could not load QR code</p>
            <button 
              className="px-4 py-2 bg-[#F2A83B] text-black rounded-md text-sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <img 
            src="/lovable-uploads/3072898f-0ccc-4826-9143-24cea560e44c.png" 
            alt="QR Code" 
            className="w-64 h-64 object-contain"
            onError={() => setHasError(true)}
          />
        )}
      </motion.div>
      
      <motion.div
        className="bg-[#F2A83B]/10 border border-[#F2A83B]/30 rounded-lg p-3 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-start">
          <Check size={16} className="text-[#F2A83B] mt-1 mr-2 flex-shrink-0" />
          <p className="text-white/90 text-sm">
            Scan to pay with any UPI app. Keep this page open until payment is confirmed.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCodeDisplay;
