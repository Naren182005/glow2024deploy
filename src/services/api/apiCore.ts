
/**
 * Core API utilities for making requests
 */

// Use environment variables for API URL with fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
console.log("API base URL:", API_BASE_URL); // Log the API URL for debugging

// API Key for secure endpoints
export const API_KEY = "193930cd-d040-4a41-82d7-0b8ffe4a98b4";

// Common headers for API requests
export const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
  'x-api-key': API_KEY
});

// Common function to handle API requests with timeout
export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
