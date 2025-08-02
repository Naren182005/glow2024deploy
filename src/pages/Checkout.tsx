
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ShippingDetailsForm from '@/components/checkout/ShippingDetailsForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';

const Checkout = () => {
  const { totalAmount } = useCart();
  const { createOrder, isCreating } = useOrders();
  const { 
    formValues, 
    isCoimbatore, 
    freeShipping, 
    shippingCost,
    handleInputChange,
    validateForm
  } = useCheckoutForm();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare shipping address
    const shippingAddress = `${formValues.address}, ${formValues.city}, ${formValues.state} - ${formValues.pincode}`;
    
    // Create order
    await createOrder({
      shippingAddress,
      paymentMethod: formValues.paymentMethod,
      shippingCost: freeShipping ? 0 : shippingCost,
      grandTotal: freeShipping ? totalAmount : totalAmount + shippingCost,
      customerName: formValues.name,
      customerEmail: formValues.email,
      customerPhone: formValues.phone
    });
  };
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <CheckoutHeader />
        
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ShippingDetailsForm 
                formValues={formValues}
                handleInputChange={handleInputChange}
                isCoimbatore={isCoimbatore}
                totalAmount={totalAmount}
              />
              
              <PaymentMethodSelector 
                paymentMethod={formValues.paymentMethod}
                handleInputChange={handleInputChange}
              />
              
              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors disabled:opacity-70"
              >
                {isCreating 
                  ? 'Processing...' 
                  : formValues.paymentMethod === 'cod' 
                    ? 'Place Order' 
                    : 'Continue to Payment'}
              </button>
            </form>
          </div>
          
          <div className="w-full md:w-96">
            <OrderSummary 
              freeShipping={freeShipping}
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
