
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QrCode, Truck } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'qrcode' | 'cod';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PaymentMethodSelector = ({ paymentMethod, handleInputChange }: PaymentMethodSelectorProps) => {
  // Custom handler for RadioGroup since it has a different event structure
  const handleRadioChange = (value: string) => {
    handleInputChange({
      target: {
        name: 'paymentMethod',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-white/10 transition-all duration-300 hover:border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
      
      <RadioGroup value={paymentMethod} onValueChange={handleRadioChange} className="space-y-4">
        <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-white/10 transition-all duration-300 border border-[#F2A83B]/30 bg-[#F2A83B]/5">
          <RadioGroupItem value="qrcode" id="qrcode" className="text-[#F2A83B]" />
          <div className="flex items-center">
            <QrCode size={20} className="text-[#F2A83B] mr-2" />
            <div>
              <Label htmlFor="qrcode" className="text-white cursor-pointer">UPI QR Code Payment</Label>
              <p className="text-xs text-white/60 mt-1">Scan QR code with any UPI app and verify with transaction ID</p>
            </div>
          </div>
          <div className="ml-auto">
            <img src="/lovable-uploads/3072898f-0ccc-4826-9143-24cea560e44c.png" alt="UPI QR Code" className="h-8 rounded" />
          </div>
        </div>
        
        <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-white/10 transition-all duration-300 border border-blue-500/30 bg-blue-500/5">
          <RadioGroupItem value="cod" id="cod" className="text-blue-500" />
          <div className="flex items-center">
            <Truck size={20} className="text-blue-500 mr-2" />
            <div>
              <Label htmlFor="cod" className="text-white cursor-pointer">Cash on Delivery (via Blue Dart)</Label>
              <p className="text-xs text-white/60 mt-1">Pay when you receive your order via Blue Dart courier service</p>
            </div>
          </div>
          <div className="ml-auto">
            <img 
              src="https://logowik.com/content/uploads/images/blue-dart-express4889.logowik.com.webp" 
              alt="Blue Dart" 
              className="h-7 object-contain" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Blue_Dart_logo.svg/2560px-Blue_Dart_logo.svg.png";
              }}
            />
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
