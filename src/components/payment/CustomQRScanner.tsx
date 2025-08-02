import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, AlertCircle, Scan, Timer } from 'lucide-react';

interface CustomQRScannerProps {
  amount: number;
  onPaymentComplete: (transactionId: string) => void;
}

const CustomQRScanner = ({ amount, onPaymentComplete }: CustomQRScannerProps) => {
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [transactionId, setTransactionId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  
  useEffect(() => {
    // Set countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowExpired(true);
    }
  }, [countdown]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setValidationError('Please enter a transaction ID');
      return;
    }
    
    setIsValidating(true);
    setValidationError('');
    
    try {
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would validate the transaction ID with your payment processor
      // For demo purposes, we'll accept any transaction ID that's at least 6 characters
      if (transactionId.length < 6) {
        setValidationError('Invalid transaction ID. Please check and try again.');
        setIsValidating(false);
        return;
      }
      
      // Calculate delivery time based on transaction ID (simulated)
      // In a real app, this would be based on user's location
      const deliveryDays = (transactionId.length % 3) + 2; // 2-4 days based on transaction ID length
      
      onPaymentComplete(transactionId);
    } catch (error) {
      setValidationError('An error occurred. Please try again.');
      setIsValidating(false);
    }
  };
  
  const resetTimer = () => {
    setCountdown(120);
    setShowExpired(false);
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center mb-4 space-x-2">
        <motion.div
          animate={{ scale: countdown < 30 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: countdown < 30 ? Infinity : 0, duration: 1 }}
        >
          <Timer size={18} className={countdown < 30 ? "text-red-500" : "text-[#F2A83B]"} />
        </motion.div>
        <p className={`font-medium text-lg ${countdown < 30 ? "text-red-500" : "text-[#F2A83B]"}`}>
          Time remaining: {formatTime(countdown)}
        </p>
        {countdown < 30 && (
          <button 
            onClick={resetTimer}
            className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-2 py-1 rounded-full transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Countdown progress bar */}
      <div className="w-full max-w-md h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-[#F2A83B]"
          initial={{ width: '100%' }}
          animate={{ width: `${(countdown / 120) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <motion.div 
        className="bg-white p-5 rounded-lg mb-5 shadow-lg shadow-white/10 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4 border-2 border-dashed border-[#F2A83B] rounded-lg flex items-center justify-center bg-black/20">
            <img 
              src="/lovable-uploads/3072898f-0ccc-4826-9143-24cea560e44c.png" 
              alt="QR Code" 
              className="w-56 h-56 object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-full h-full flex items-center justify-center"
                animate={{ 
                  boxShadow: ["0 0 0 rgba(242, 168, 59, 0)", "0 0 20px rgba(242, 168, 59, 0.5)", "0 0 0 rgba(242, 168, 59, 0)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scan size={32} className="text-[#F2A83B] opacity-70" />
              </motion.div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-black font-bold text-xl mb-1">₹{amount?.toFixed(2)}</p>
            <p className="text-gray-600 text-sm">Scan with any UPI app</p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Transaction ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="e.g. UPI123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2A83B] focus:border-transparent pl-10"
                  disabled={isValidating || countdown === 0}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Check size={16} className="text-gray-400" />
                </div>
              </div>
              {validationError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />
                  {validationError}
                </motion.p>
              )}
              {countdown === 0 && !showExpired && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-amber-500 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />
                  Time expired. Please reset the timer to continue.
                </motion.p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the transaction ID from your payment app after completing the payment
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isValidating || !transactionId.trim() || countdown === 0}
              className="w-full py-2 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </form>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-[#F2A83B]/10 border border-[#F2A83B]/30 rounded-lg p-3 max-w-md w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-start">
          <Check size={16} className="text-[#F2A83B] mt-1 mr-2 flex-shrink-0" />
          <p className="text-white/90 text-sm">
            After scanning and completing payment in your UPI app, enter the transaction ID to confirm your payment.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomQRScanner;