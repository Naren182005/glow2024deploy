import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Scan, Timer, RefreshCw, Copy, CheckCircle, MessageCircle } from 'lucide-react';

interface CustomQRScannerProps {
  amount: number;
  onPaymentComplete: (transactionId: string) => void;
}

const CustomQRScanner = ({ amount, onPaymentComplete }: CustomQRScannerProps) => {
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [transactionId, setTransactionId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [upiId, setUpiId] = useState('glow24organics@paytm');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  // Function to generate WhatsApp message with all order details
  const generateWhatsAppMessage = () => {
    const customerInfo = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    let message = `🛍️ *NEW ORDER FROM GLOW24 ORGANICS*\n\n`;
    message += `📋 *Order ID:* ${Date.now()}\n\n`;

    // Customer Details
    message += `👤 *CUSTOMER DETAILS:*\n`;
    message += `Name: ${customerInfo.name || 'Not provided'}\n`;
    message += `Email: ${customerInfo.email || 'Not provided'}\n`;
    message += `Phone: ${customerInfo.phone || 'Not provided'}\n\n`;

    // Shipping Address
    message += `📍 *SHIPPING ADDRESS:*\n`;
    message += `${customerInfo.address || 'Not provided'}\n`;
    message += `City: ${customerInfo.city || 'Not provided'}\n`;
    message += `State: ${customerInfo.state || 'Not provided'}\n`;
    message += `Pincode: ${customerInfo.pincode || 'Not provided'}\n\n`;

    // Order Items
    message += `🛒 *ORDER ITEMS:*\n`;
    if (cartItems.length > 0) {
      cartItems.forEach((item: any, index: number) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₹${item.price}\n`;
        message += `   Subtotal: ₹${item.price * item.quantity}\n\n`;
      });
    }

    // Order Total
    message += `💰 *ORDER TOTAL: ₹${amount}*\n\n`;

    // Payment Method
    message += `💳 *Payment Method:* UPI/Online Payment\n\n`;

    // Additional Info
    message += `📅 *Order Date:* ${new Date().toLocaleDateString('en-IN')}\n`;
    message += `⏰ *Order Time:* ${new Date().toLocaleTimeString('en-IN')}\n\n`;

    message += `✅ *Please confirm this order and provide delivery timeline.*\n\n`;
    message += `Thank you for choosing Glow24 Organics! 🌿`;

    return encodeURIComponent(message);
  };

  useEffect(() => {
    // Generate UPI payment string
    const upiString = `upi://pay?pa=${upiId}&pn=Glow24%20Organics&am=${amount}&cu=INR&tn=Payment%20for%20Order`;
    setQrCodeData(upiString);
  }, [amount, upiId]);

  useEffect(() => {
    // Set countdown timer
    if (countdown > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowExpired(true);
    }
  }, [countdown, paymentStatus]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  const validateTransactionId = (txnId: string): boolean => {
    // Enhanced validation for common UPI transaction ID patterns
    const patterns = [
      /^[0-9]{12}$/,  // 12 digit numeric
      /^[A-Z0-9]{10,20}$/,  // Alphanumeric 10-20 chars
      /^pay_[A-Za-z0-9]{14}$/,  // Razorpay pattern
      /^txn_[A-Za-z0-9]{10,}$/,  // Generic transaction pattern
      /^[0-9]{6,16}$/,  // 6-16 digit numeric
    ];

    return patterns.some(pattern => pattern.test(txnId.trim()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      setValidationError('Please enter a transaction ID');
      return;
    }

    if (!validateTransactionId(transactionId)) {
      setValidationError('Please enter a valid transaction ID (minimum 6 characters)');
      return;
    }

    setIsValidating(true);
    setPaymentStatus('processing');
    setValidationError('');

    try {
      // Simulate payment verification with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment verification API call
      const verificationResult = await simulatePaymentVerification(transactionId, amount);

      if (verificationResult.success) {
        setPaymentStatus('completed');
        onPaymentComplete(transactionId);
      } else {
        setPaymentStatus('failed');
        setValidationError(verificationResult.message || 'Payment verification failed. Please check your transaction ID.');
        setIsValidating(false);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setValidationError('An error occurred during verification. Please try again.');
      setIsValidating(false);
    }
  };

  const simulatePaymentVerification = async (txnId: string, amount: number) => {
    // Import the validation service
    const { validateTransactionId } = await import('@/services/paymentService');

    // Use the enhanced validation service
    return await validateTransactionId(txnId, amount);
  };
  
  const resetTimer = () => {
    setCountdown(300);
    setShowExpired(false);
    setPaymentStatus('pending');
    setTransactionId('');
    setValidationError('');
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center mb-4 space-x-2">
        <motion.div
          animate={{ scale: countdown < 30 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: countdown < 30 ? Infinity : 0, duration: 1 }}
        >
          <Timer size={18} className={countdown < 30 ? "text-red-500" : "text-[#F2A83B]"} />
        </motion.div>
        <p className={`font-medium text-lg ${countdown < 30 ? "text-red-500" : "text-[#F2A83B]"}`}>
          Time remaining: {formatTime(countdown)}
        </p>
        {countdown < 30 && (
          <button 
            onClick={resetTimer}
            className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-2 py-1 rounded-full transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Countdown progress bar */}
      <div className="w-full max-w-md h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div
          className={`h-full ${countdown < 60 ? 'bg-red-500' : countdown < 120 ? 'bg-yellow-500' : 'bg-[#F2A83B]'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(countdown / 300) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <motion.div
        className="bg-white p-6 rounded-xl mb-6 shadow-lg shadow-white/10 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex flex-col items-center">
          {/* QR Code Section */}
          <div className="relative w-64 h-64 mb-4 border-2 border-dashed border-[#F2A83B] rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {qrCodeData ? (
              <div className="w-56 h-56 bg-white rounded-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=224x224&data=${encodeURIComponent(qrCodeData)}`}
                  alt="UPI Payment QR Code"
                  className="w-52 h-52 object-contain"
                />
              </div>
            ) : (
              <div className="w-56 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                  <p className="text-gray-500 text-sm">Generating QR Code...</p>
                </div>
              </div>
            )}

            {paymentStatus === 'pending' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  animate={{
                    boxShadow: ["0 0 0 rgba(242, 168, 59, 0)", "0 0 20px rgba(242, 168, 59, 0.5)", "0 0 0 rgba(242, 168, 59, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Scan size={32} className="text-[#F2A83B] opacity-70" />
                </motion.div>
              </div>
            )}
          </div>

          {/* UPI ID Section */}
          <div className="w-full mb-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                <p className="text-sm font-mono text-gray-800">{upiId}</p>
              </div>
              <button
                onClick={copyUpiId}
                className="ml-2 p-2 text-gray-500 hover:text-[#F2A83B] transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          
          {/* Payment Amount */}
          <div className="text-center mb-6">
            <div className="bg-[#F2A83B] text-black px-4 py-2 rounded-lg mb-2">
              <p className="font-bold text-2xl">₹{amount?.toFixed(2)}</p>
            </div>
            <p className="text-gray-600 text-sm">Scan with any UPI app or pay manually</p>
            <p className="text-gray-500 text-xs mt-1">Payment to: Glow24 Organics</p>
          </div>
          
          {/* Transaction Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Transaction ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value.toUpperCase());
                    setValidationError('');
                    setPaymentStatus('pending');
                  }}
                  placeholder="e.g. TXN123456789, pay_ABC123DEF456"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent pl-12 ${
                    validationError
                      ? 'border-red-300 focus:ring-red-500'
                      : paymentStatus === 'completed'
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-[#F2A83B]'
                  }`}
                  disabled={isValidating || countdown === 0 || paymentStatus === 'completed'}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {paymentStatus === 'completed' ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : paymentStatus === 'processing' ? (
                    <RefreshCw size={18} className="text-[#F2A83B] animate-spin" />
                  ) : (
                    <Check size={18} className="text-gray-400" />
                  )}
                </div>
              </div>
              {/* Error Messages */}
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md"
                  >
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-2 flex-shrink-0" />
                      {validationError}
                    </p>
                  </motion.div>
                )}

                {paymentStatus === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"
                  >
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle size={14} className="mr-2 flex-shrink-0" />
                      Payment verified successfully!
                    </p>
                  </motion.div>
                )}

                {countdown === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md"
                  >
                    <p className="text-sm text-amber-600 flex items-center">
                      <AlertCircle size={14} className="mr-2 flex-shrink-0" />
                      Session expired. Please reset the timer to continue.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>• Complete payment using any UPI app</p>
                <p>• Enter the transaction ID you receive</p>
                <p>• Transaction ID should be 6+ characters</p>
              </div>
            </div>
            
            {/* WhatsApp Submit Button */}
            <a
              href={`https://wa.me/+919363717744?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 w-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <MessageCircle size={24} />
              <span className="text-lg">Submit your order to WhatsApp</span>
            </a>
          </form>
        </div>
      </motion.div>
      
      {/* Payment Instructions */}
      <motion.div
        className="bg-[#F2A83B]/10 border border-[#F2A83B]/30 rounded-xl p-4 max-w-md w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="space-y-3">
          <div className="flex items-center text-[#F2A83B] font-medium">
            <Scan size={18} className="mr-2" />
            Payment Instructions
          </div>

          <div className="space-y-2 text-white/90 text-sm">
            <div className="flex items-start">
              <span className="bg-[#F2A83B] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
              <p>Scan the QR code with any UPI app (GPay, PhonePe, Paytm, etc.)</p>
            </div>

            <div className="flex items-start">
              <span className="bg-[#F2A83B] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
              <p>Or manually pay ₹{amount?.toFixed(2)} to UPI ID: <span className="font-mono text-[#F2A83B]">{upiId}</span></p>
            </div>

            <div className="flex items-start">
              <span className="bg-[#F2A83B] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
              <p>After successful payment, enter the transaction ID above and click "Verify Payment"</p>
            </div>
          </div>

          <div className="mt-3 p-2 bg-white/5 rounded-lg">
            <p className="text-white/70 text-xs">
              <strong>Note:</strong> Your session will expire in {formatTime(countdown)}.
              {countdown < 60 && " Please complete payment soon."}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomQRScanner;