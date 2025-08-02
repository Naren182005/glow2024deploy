
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/mongodb');

// Sample product data as fallback if MongoDB connection fails
const fallbackProducts = [
  {
    id: 3,
    name: "Hair Oil (100ml)",
    description: "Concentrated hair oil formula in a convenient 100ml size. Perfect for nourishing and strengthening hair follicles.",
    price: 150,
    image: "/lovable-uploads/666e7309-d5d2-456a-ba0a-2bd5e0db41f6.png",
    category: 'hair-care',
    stock: "In Stock"
  },
  {
    id: 4,
    name: "Hair Oil (200ml)",
    description: "Premium hair oil in a larger 200ml bottle. Our signature formula for stronger, healthier hair with more value.",
    price: 250,
    image: "/lovable-uploads/666e7309-d5d2-456a-ba0a-2bd5e0db41f6.png",
    category: 'hair-care',
    stock: "In Stock"
  },
  {
    id: 2,
    name: "Rosemary Spray",
    description: "Refreshing rosemary spray that stimulates the scalp and adds shine to hair.",
    price: 150,
    image: "/lovable-uploads/8b6970d3-aa7a-4b17-b67b-3b06dd0b3383.png",
    category: 'hair-care',
    stock: "In Stock"
  },
  {
    id: 5,
    name: "Strawberry Lip Balm",
    description: "Hydrating strawberry lip balm that moisturizes and nourishes dry lips with natural ingredients.",
    price: 70,
    image: "/lovable-uploads/d88e1db7-feda-4585-9e8b-041a50bf6268.png",
    category: 'lip-care',
    stock: "In Stock"
  }
];

// GET all products
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    // Try to connect to MongoDB and fetch products
    const db = await connectToDatabase();
    console.log('Successfully connected to database');
    
    const collection = db.collection('products');
    console.log('Accessing products collection');
    
    // Get the category from query params if provided
    const category = req.query.category;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    const products = await collection.find(query).toArray();
    
    console.log(`Fetched ${products.length} products from MongoDB Atlas`);
    
    if (products.length === 0) {
      console.log('No products found in database. Using fallback data');
      // Filter fallback data if category is provided
      const filteredFallback = category 
        ? fallbackProducts.filter(p => p.category === category)
        : fallbackProducts;
      return res.json(filteredFallback);
    }
    
    // Adding artificial delay to simulate network latency
    setTimeout(() => {
      res.json(products);
    }, 300);
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error.message);
    
    // Return fallback data in case of error, filtered by category if provided
    console.log('Using fallback product data');
    const category = req.query.category;
    const filteredFallback = category 
      ? fallbackProducts.filter(p => p.category === category)
      : fallbackProducts;
    res.json(filteredFallback);
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');
    
    // If id is a valid ObjectId, use it directly, otherwise try to match by numeric id
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const { ObjectId } = require('mongodb');
      product = await collection.findOne({ _id: new ObjectId(id) });
    } else {
      product = await collection.findOne({ id: parseInt(id) });
    }
    
    if (!product) {
      // Try fallback data if MongoDB doesn't have the product
      const fallbackProduct = fallbackProducts.find(p => p.id === parseInt(id));
      if (fallbackProduct) {
        return res.json(fallbackProduct);
      }
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    
    // Try to return from fallback data
    const fallbackProduct = fallbackProducts.find(p => p.id === parseInt(id));
    if (fallbackProduct) {
      return res.json(fallbackProduct);
    }
    
    return res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
