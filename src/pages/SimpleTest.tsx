import React from 'react';

const SimpleTest = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#F2A83B] mb-4">🌿 Glow24 Organics</h1>
        <p className="text-xl text-white/80 mb-6">Simple Test Page - If you see this, React is working!</p>
        
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold">✅ React App Loading</h3>
            <p className="text-sm text-white/70">The React application is rendering correctly</p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold">✅ Tailwind CSS Working</h3>
            <p className="text-sm text-white/70">Styling and responsive design is functional</p>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold">✅ Components Rendering</h3>
            <p className="text-sm text-white/70">No JavaScript errors preventing rendering</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-[#F2A83B] hover:bg-[#F2A83B]/80 text-black px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            🏠 Go to Homepage
          </a>
        </div>
        
        <div className="mt-6 text-sm text-white/60">
          <p>If the homepage shows a black screen, there's an error in the main components.</p>
          <p>Check browser console for error details.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
