import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="animate-spin w-16 h-16 border-4 border-[#F2A83B] border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-[#F2A83B] mb-2">Glow24 Organics</h1>
          <p className="text-white/70">Loading your organic beauty experience...</p>
        </div>
        
        <div className="space-y-2 text-sm text-white/50">
          <p>🌿 Preparing natural products</p>
          <p>🛒 Setting up your cart</p>
          <p>📱 Connecting WhatsApp integration</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
