
# Glow24 Organics - Full Stack Application

This project consists of a React frontend and an Express backend server for the Glow24 Organics e-commerce application.

## Project Structure

```
/
├── src/                  # Frontend React application
├── server/               # Backend Express server
│   ├── index.js          # Server entry point
│   ├── routes/           # API routes
│   │   ├── products.js   # Products API
│   │   └── orders.js     # Orders API
│   └── package.json      # Server dependencies
├── .env                  # Environment variables for frontend
└── server/.env           # Environment variables for backend
```

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Set Up Environment Variables
- Frontend (.env in root directory):
  ```
  VITE_API_URL=http://localhost:5000
  ```
- Backend (server/.env):
  ```
  PORT=5000
  ```

## Running the Application

### Development Mode

#### Option 1: Run Frontend and Backend Separately
1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

#### Option 2: Run Both Concurrently
Use the provided script to run both frontend and backend concurrently:
```bash
node run-dev.js
```

### Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set up a production server to:
   - Serve the Express backend
   - Serve the static files from the `dist` directory

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderId/track` - Get tracking information for an order
- `PUT /api/orders/:orderId/status` - Update order status

## Troubleshooting

If you encounter issues with package installation:
- Make sure you're using a compatible Node.js version (v14+ recommended)
- If specific packages fail to build, try using npm instead of Bun for installation
- Clear node_modules and package-lock.json before reinstalling dependencies
