
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

export interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'qrcode' | 'cod';
}

export const useCheckoutForm = () => {
  const { user, profile } = useAuth();
  const { totalAmount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'qrcode', // Default to QR code payment
  });
  
  const [isCoimbatore, setIsCoimbatore] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState(100);
  
  useEffect(() => {
    // Redirect to home if cart is empty
    const storedItems = localStorage.getItem('cartItems');
    if (!storedItems || JSON.parse(storedItems).length === 0) {
      navigate('/');
    }

    // Load existing form data from localStorage
    const storedFormData = localStorage.getItem('checkoutFormData');
    if (storedFormData) {
      try {
        const parsedFormData = JSON.parse(storedFormData);
        setFormValues(parsedFormData);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }

    // Populate form with user profile if available (only if no stored data)
    if (profile && !storedFormData) {
      setFormValues(prev => ({
        ...prev,
        name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      }));
    }
  }, [navigate, profile, user]);
  
  useEffect(() => {
    const coimbatorePincodes = ['641001', '641002', '641003', '641004', '641005', '641006', '641007', '641008', '641009', '641010', '641011', '641012', '641013', '641014', '641015', '641016', '641017', '641018', '641019', '641020', '641021', '641022', '641023', '641024', '641025', '641026', '641027', '641028', '641029', '641030', '641031', '641032', '641033', '641034', '641035', '641036', '641037', '641038', '641039', '641040', '641041', '641042', '641043', '641044', '641045', '641046', '641047', '641048', '641049', '641050', '641061', '641062', '641063', '641064', '641065', '641101', '641102', '641103', '641104', '641105', '641106', '641107', '641108', '641109', '641110', '641111', '641112', '641113', '641114', '641201', '641202', '641301', '641302', '641303', '641304', '641305', '641401', '641402', '641403', '641404', '641405', '641406', '641407'];
    
    const isCoimbatorePin = coimbatorePincodes.includes(formValues.pincode);
    setIsCoimbatore(isCoimbatorePin);
    
    const qualifiesForFreeShipping = isCoimbatorePin && totalAmount >= 999;
    setFreeShipping(qualifiesForFreeShipping);
  }, [formValues.pincode, totalAmount]);

  // Check if city is Coimbatore and switch payment method accordingly
  useEffect(() => {
    const isCoimbatoreCity = formValues.city?.toLowerCase().includes('coimbatore') || false;

    // If city is not Coimbatore and payment method is COD, switch to UPI
    if (!isCoimbatoreCity && formValues.paymentMethod === 'cod') {
      setFormValues(prev => ({ ...prev, paymentMethod: 'qrcode' }));
    }
  }, [formValues.city, formValues.paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFormValues = { ...formValues, [name]: value };
    setFormValues(updatedFormValues);

    // Save form data to localStorage whenever it changes
    localStorage.setItem('checkoutFormData', JSON.stringify(updatedFormValues));
    console.log('💾 Form data saved to localStorage:', updatedFormValues);
  };

  // Save form data to localStorage whenever formValues changes (backup method)
  useEffect(() => {
    if (formValues.name || formValues.email || formValues.phone || formValues.address) {
      localStorage.setItem('checkoutFormData', JSON.stringify(formValues));
    }
  }, [formValues]);

  const validateForm = () => {
    for (const [key, value] of Object.entries(formValues)) {
      if (!value) {
        toast({
          title: "Error",
          description: `Please fill in your ${key}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };
  
  return {
    formValues,
    isCoimbatore,
    freeShipping,
    shippingCost,
    handleInputChange,
    validateForm
  };
};
