
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import AboutUs from '@/components/AboutUs';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set body background to black on mount
    document.body.classList.add('bg-black');
    
    // Simulate loading for smooth entrance animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      // Cleanup
      document.body.classList.remove('bg-black');
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div 
          key="loader"
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src="/lovable-uploads/08e166cf-e063-48e7-b7dd-82bf6a86ebfc.png" 
            alt="Glow24 Logo" 
            className="w-24 h-24"
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
        </motion.div>
      ) : (
        <motion.div 
          className="min-h-screen flex flex-col bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Animated gold particles background */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="particles-container">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="particle" 
                  style={{
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`,
                    '--size': `${Math.random() * 6 + 1}px`,
                    '--duration': `${Math.random() * 20 + 10}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
          
          <div className="fixed inset-0 pointer-events-none bg-pattern opacity-10 z-0">
            {/* Repeating pattern with the logo */}
          </div>
          
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0">
            <motion.img 
              src="/lovable-uploads/08e166cf-e063-48e7-b7dd-82bf6a86ebfc.png" 
              alt="Glow24 Logo Background" 
              className="max-w-md w-full"
              animate={{ 
                opacity: [0.1, 0.15, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          
          <Header />
          <main className="flex-grow relative z-10">
            <Hero />
            <div className="section-with-bg-overlay">
              <ProductShowcase />
            </div>
            <div className="section-with-bg-overlay">
              <AboutUs />
            </div>
            <div className="section-with-bg-overlay">
              <ContactForm />
            </div>
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
