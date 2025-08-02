
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-[#F2A83B]/30"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.3 + Math.random() * 0.5
              }}
              animate={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 15 + Math.random() * 20, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Background glow */}
        <motion.div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#F2A83B]/10 blur-[100px] z-0"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="mb-6 relative mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#F2A83B]/10 blur-xl rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <img 
              src="/lovable-uploads/08e166cf-e063-48e7-b7dd-82bf6a86ebfc.png" 
              alt="Glow24 logo"
              className="h-24 sm:h-28 md:h-32 mx-auto relative z-10"
            />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="gold-shimmer">Premium Organic</span> Hair Care
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Experience the magic of nature with our handcrafted organic formulations.
            Pure, potent, and perfect for your daily self-care ritual.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link to="/hair-care" className="button-primary px-8 py-4 hover-scale">
              Shop Hair Care
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-16 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a 
              href="#products" 
              className="flex flex-col items-center text-white/50 hover:text-[#F2A83B] transition-colors"
            >
              <span className="text-sm mb-2">View Products</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
