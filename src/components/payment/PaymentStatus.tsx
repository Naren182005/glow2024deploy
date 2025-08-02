
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentStatusProps {
  status: 'pending' | 'completed';
  countdown: number;
  onConfirmPayment: () => void;
}

const PaymentStatus = ({ status, countdown, onConfirmPayment }: PaymentStatusProps) => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  
  useEffect(() => {
    if (status === 'completed') {
      setLiveUpdate(true);
      // Simulate a small delay before showing the confirmation animation
      const timer = setTimeout(() => setLiveUpdate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div 
      className="mb-8 flex flex-col items-center space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {status === 'pending' ? (
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center mb-3">
            <Clock size={24} className="text-amber-400" />
          </div>
          <p className="text-amber-400 font-medium text-lg">Payment pending</p>
          <p className="text-white/60 text-sm">Expires in {formatTime(countdown)}</p>
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: liveUpdate ? [0, 5, 0, -5, 0] : 0
          }}
          transition={{ 
            scale: { 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            },
            rotate: {
              duration: 0.5,
              repeat: 2,
              repeatType: "reverse"
            }
          }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3"
            animate={liveUpdate ? {
              boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.5)", "0 0 0 rgba(34, 197, 94, 0)"]
            } : {}}
            transition={{ duration: 1.5, repeat: 1 }}
          >
            <CheckCircle size={24} className="text-green-500" />
          </motion.div>
          <p className="text-green-500 font-medium text-lg">Payment completed!</p>
          <motion.p 
            className="text-white/60 text-sm"
            animate={liveUpdate ? { 
              y: [0, -5, 0],
              opacity: [1, 0.7, 1] 
            } : {}}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            Thank you for your payment
          </motion.p>
        </motion.div>
      )}
      
      <motion.button
        onClick={onConfirmPayment}
        className="group py-3 px-6 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors shadow-lg hover:shadow-xl hover:shadow-[#F2A83B]/20 transform transition-transform duration-300 flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {status === 'completed' ? 'Continue to Order Tracking' : 'I\'ve Completed the Payment'}
        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
};

export default PaymentStatus;
