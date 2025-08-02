import { useState, useEffect } from 'react';
import { ProductProps } from '@/components/ProductCard';

// Local product data
const localProductData: ProductProps[] = [
  {
    id: 3,
    name: "Hair Oil (100ml)",
    description: "Concentrated hair oil formula in a convenient 100ml size. Perfect for nourishing and strengthening hair follicles.",
    price: 150,
    image: "/lovable-uploads/666e7309-d5d2-456a-ba0a-2bd5e0db41f6.png",
    category: 'hair-care',
    isBestSeller: true
  },
  {
    id: 4,
    name: "Hair Oil (200ml)",
    description: "Premium hair oil in a larger 200ml bottle. Our signature formula for stronger, healthier hair with more value.",
    price: 250,
    image: "/lovable-uploads/666e7309-d5d2-456a-ba0a-2bd5e0db41f6.png",
    category: 'hair-care'
  },
  {
    id: 2,
    name: "Rosemary Spray",
    description: "Refreshing rosemary spray that stimulates the scalp and adds shine to hair.",
    price: 150,
    image: "/lovable-uploads/8b6970d3-aa7a-4b17-b67b-3b06dd0b3383.png",
    category: 'hair-care'
  },
  {
    id: 5,
    name: "Strawberry Lip Balm",
    description: "Hydrating strawberry lip balm that moisturizes and nourishes dry lips with natural ingredients.",
    price: 70,
    image: "/lovable-uploads/d88e1db7-feda-4585-9e8b-041a50bf6268.png",
    isBestSeller: true,
    category: 'lip-care'
  }
];

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Filter products by category if specified
        const filteredProducts = category 
          ? localProductData.filter(product => product.category === category)
          : localProductData;
          
        // Simulate loading delay
        setTimeout(() => {
          setProducts(filteredProducts);
          setLoading(false);
          setIsUsingFallback(false);
        }, 500);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err : new Error("Unknown error loading products"));
        setIsUsingFallback(true);
        setProducts(category 
          ? localProductData.filter(product => product.category === category)
          : localProductData);
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    
    // Simulate network request retry
    setTimeout(() => {
      // Filter products by category if specified
      const filteredProducts = category 
        ? localProductData.filter(product => product.category === category)
        : localProductData;
        
      setProducts(filteredProducts);
      setLoading(false);
      setIsUsingFallback(false);
    }, 500);
  };

  return {
    products,
    loading,
    error,
    isUsingFallback,
    retryFetch
  };
};
