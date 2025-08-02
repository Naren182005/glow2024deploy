
import { Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const footerEl = document.getElementById('footer');
    if (footerEl) {
      observer.observe(footerEl);
    }
    
    return () => {
      if (footerEl) {
        observer.unobserve(footerEl);
      }
    };
  }, []);
  
  return (
    <footer 
      id="footer" 
      className="py-10 bg-black border-t border-[#F2A83B]/20"
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col items-center justify-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-[#F2A83B]/5 blur-xl rounded-full"></div>
            <img 
              src="/lovable-uploads/08e166cf-e063-48e7-b7dd-82bf6a86ebfc.png" 
              alt="Glow24 Organics" 
              className="h-24 mb-2 relative z-10 hover-scale" 
            />
            <p className="text-xs text-white/70 tracking-widest text-center uppercase">
              Natural Hair & Skin Care Products
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mb-8">
            <a 
              href="https://www.instagram.com/glow__24__?igsh=OHE0aG81bjY0cXBm" 
              className="text-[#F2A83B]/80 hover:text-[#F2A83B] transition-colors duration-300 transform hover:scale-110 p-3 rounded-full hover:bg-[#F2A83B]/10"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={28} />
            </a>
            <a 
              href="https://wa.me/919363717744" 
              className="text-[#F2A83B]/80 hover:text-[#F2A83B] transition-colors duration-300 transform hover:scale-110 p-3 rounded-full hover:bg-[#F2A83B]/10"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={28} />
            </a>
          </div>
          
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
              <Link to="/" className="text-white/70 hover:text-[#F2A83B] transition-colors duration-300 relative group">
                Home
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F2A83B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/hair-care" className="text-white/70 hover:text-[#F2A83B] transition-colors duration-300 relative group">
                Hair Care
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F2A83B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/skin-care" className="text-white/70 hover:text-[#F2A83B] transition-colors duration-300 relative group">
                Skin Care
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F2A83B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <a href="#contact" className="text-white/70 hover:text-[#F2A83B] transition-colors duration-300 relative group">
                Contact
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F2A83B] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            
            <p className="text-white/50 text-sm">
              © {currentYear} Glow24 Organics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
