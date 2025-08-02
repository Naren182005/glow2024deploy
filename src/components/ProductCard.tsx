import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isBestSeller?: boolean;
  category?: string;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    // Removed the toast notification for a smoother UX as requested
  };
  
  return (
    <div 
      className="group relative h-[400px] glass-card rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#F2A83B]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-500 filter"
          style={{ 
            backgroundImage: `url(${product.image})`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      
      {/* Product Badge */}
      <div className="absolute top-4 left-4 bg-[#F2A83B] text-black text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        ORGANIC
      </div>
      
      {/* Category Badge */}
      {product.category && (
        <div className="absolute top-4 right-16 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {product.category === 'hair-care' ? 'HAIR CARE' : 'SKIN CARE'}
        </div>
      )}
      
      {/* Best Seller Badge */}
      {product.isBestSeller && (
        <div className="absolute top-12 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 animate-pulse">
          BEST SELLER
        </div>
      )}
      
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col space-y-2 transform transition-all duration-300" 
        style={{ transform: isHovered ? 'translateY(-12px)' : 'translateY(0)' }}>
        <h3 className="text-xl font-bold text-white">
          {product.name}
        </h3>
        
        <p className={`text-white/80 text-sm line-clamp-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          {product.description}
        </p>
        
        <div className="pt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-[#F2A83B]">₹{product.price.toFixed(2)}</span>
          
          <button 
            className="bg-[#F2A83B] hover:bg-[#F2A83B]/90 text-black flex items-center gap-1 py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#F2A83B]/20"
            onClick={handleBuyNow}
          >
            <ShoppingCart size={16} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
      
      <div 
        className={`absolute top-4 right-4 h-12 w-12 glass-card rounded-full flex items-center justify-center cursor-pointer transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isFavorite ? 'bg-[#F2A83B]/20' : 'bg-black/30'}`}
        onClick={toggleFavorite}
      >
        <Heart 
          size={18} 
          className={isFavorite ? 'text-[#F2A83B] fill-[#F2A83B]' : 'text-white'} 
        />
      </div>
    </div>
  );
};

export default ProductCard;
