import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentTest = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Test all payment-related functionality
    const runTests = () => {
      const results: any = {};

      // Test 1: Check localStorage data
      try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const checkoutFormData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
        
        results.localStorage = {
          status: 'success',
          cartItems: cartItems.length,
          formData: Object.keys(checkoutFormData).length
        };
      } catch (error) {
        results.localStorage = {
          status: 'error',
          error: error.message
        };
      }

      // Test 2: WhatsApp URL generation
      try {
        const testMessage = "Test order from Glow24 Organics";
        const whatsappUrl = `https://wa.me/+919363717744?text=${encodeURIComponent(testMessage)}`;
        results.whatsapp = {
          status: 'success',
          url: whatsappUrl
        };
      } catch (error) {
        results.whatsapp = {
          status: 'error',
          error: error.message
        };
      }

      // Test 3: Payment method detection
      try {
        const testCity = 'Coimbatore';
        const isCoimbatore = testCity.toLowerCase().includes('coimbatore');
        results.paymentDetection = {
          status: 'success',
          coimbatoreDetected: isCoimbatore
        };
      } catch (error) {
        results.paymentDetection = {
          status: 'error',
          error: error.message
        };
      }

      setTestResults(results);
      setIsLoading(false);
    };

    runTests();
  }, []);

  const testWhatsAppMessage = () => {
    const testMessage = `🛍️ *TEST ORDER FROM GLOW24 ORGANICS*

📋 *Order ID:* TEST_${Date.now()}

👤 *CUSTOMER DETAILS:*
Name: Test Customer
Email: test@example.com
Phone: +91 9876543210

📍 *SHIPPING ADDRESS:*
123 Test Street
City: Coimbatore
State: Tamil Nadu
Pincode: 641001

🛒 *ORDER ITEMS:*
1. Test Product
   Quantity: 1
   Price: ₹100
   Subtotal: ₹100

💰 *ORDER TOTAL: ₹100*

💳 *Payment Method:* Test

📅 *Order Date:* ${new Date().toLocaleDateString('en-IN')}
⏰ *Order Time:* ${new Date().toLocaleTimeString('en-IN')}

✅ *This is a test order.*

Thank you for choosing Glow24 Organics! 🌿`;

    const whatsappUrl = `https://wa.me/+919363717744?text=${encodeURIComponent(testMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-[#F2A83B]">Payment System Test</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-[#F2A83B] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Running payment system tests...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Test Results */}
            {Object.entries(testResults).map(([testName, result]: [string, any]) => (
              <div key={testName} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                  )}
                  <h3 className="font-semibold capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h3>
                </div>
                <pre className="text-sm text-white/70 bg-black/30 p-3 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}

            {/* Test WhatsApp Button */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="font-semibold mb-4 flex items-center">
                <MessageCircle className="text-green-500 mr-2" size={20} />
                WhatsApp Integration Test
              </h3>
              <button
                onClick={testWhatsAppMessage}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Test WhatsApp Message</span>
              </button>
              <p className="text-sm text-white/60 mt-2">
                This will open WhatsApp with a test order message
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTest;
