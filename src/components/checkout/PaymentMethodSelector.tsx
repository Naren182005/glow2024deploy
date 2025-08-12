
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QrCode, Truck, AlertCircle } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'qrcode' | 'cod';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  customerCity?: string;
}

const PaymentMethodSelector = ({ paymentMethod, handleInputChange, customerCity }: PaymentMethodSelectorProps) => {
  // Check if customer city is Coimbatore (case insensitive)
  const isCoimbatoreCity = customerCity?.toLowerCase().includes('coimbatore') || false;

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
        {/* UPI QR Code Payment - Always Available */}
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

        {/* Cash on Delivery - Only for Coimbatore */}
        {isCoimbatoreCity ? (
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
        ) : (
          /* Message for non-Coimbatore cities */
          <div className="p-4 rounded-md border border-orange-500/30 bg-orange-500/10">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-orange-400 font-medium text-sm">Cash on Delivery Not Available</h3>
                <p className="text-orange-300/80 text-xs mt-1">
                  Sorry, we have Cash on Delivery available only around Coimbatore main areas.
                  Please use UPI QR Code payment for your location.
                </p>
              </div>
            </div>
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
