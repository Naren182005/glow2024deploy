
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface ShippingFormProps {
  formValues: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isCoimbatore: boolean;
  totalAmount: number;
}

const ShippingDetailsForm = ({ formValues, handleInputChange, isCoimbatore, totalAmount }: ShippingFormProps) => {
  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Shipping Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-white/70 mb-2 text-sm">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-white/70 mb-2 text-sm">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-white/70 mb-2 text-sm">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-white/70 mb-2 text-sm">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-white/70 mb-2 text-sm">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formValues.city}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-white/70 mb-2 text-sm">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formValues.state}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="pincode" className="block text-white/70 mb-2 text-sm">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formValues.pincode}
            onChange={handleInputChange}
            className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#F2A83B]"
            required
          />
          {isCoimbatore && (
            <p className="text-[#F2A83B] text-xs mt-2 flex items-center">
              <Check size={12} className="mr-1" /> 
              {totalAmount >= 999 
                ? "You're eligible for free shipping on orders above ₹999!" 
                : `Add ₹${(999 - totalAmount).toFixed(2)} more for free shipping!`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsForm;
