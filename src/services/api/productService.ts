
/**
 * API Service for product operations
 */

import { ProductProps } from '@/components/ProductCard';
import { API_BASE_URL, getHeaders, fetchWithTimeout } from './apiCore';

// Fetch all products with retry mechanism
export const fetchProducts = async (retryCount = 2): Promise<ProductProps[]> => {
  try {
    console.log(`Fetching products from: ${API_BASE_URL}/api/products`);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/products`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Products fetched successfully:", data.length);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Retry logic - attempt to fetch again if retries remain
    if (retryCount > 0) {
      console.log(`Retrying fetch products. Attempts remaining: ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchProducts(retryCount - 1);
    }
    
    // Return empty array after all retries fail
    return [];
  }
};
